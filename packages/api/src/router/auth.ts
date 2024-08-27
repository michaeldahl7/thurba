import type { TRPCRouterRecord } from "@trpc/server";

import { protectedProcedure, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { lucia } from "@acme/auth";
import { z } from "zod";
import { github } from "@acme/auth";
import { OAuth2RequestError, generateState } from "arctic";

import { parseCookies, serializeCookie } from "oslo/cookie";
import type { User, Session } from "lucia";

import { eq } from "@acme/db";
import { accounts, profiles, users } from "@acme/db/schema";

export interface GitHubUser {
  id: string;
  login: string;
  avatar_url: string;
  email: string;
}

interface Email {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
}

interface AuthCallbackResult {
  success: boolean;
  userId: number;
  isNewUser: boolean;
}

export const authRouter = {
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  githubLogin: publicProcedure.mutation(async ({ ctx }) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    ctx.honoContext.header(
      "Set-Cookie",
      serializeCookie("github_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
      }),
    );
    console.log("url", url.toString());
    return { url: url.toString() };
  }),

  githubCallback: publicProcedure
    .input(
      z.object({
        code: z.string(),
        state: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { honoContext, db } = ctx;
      const { code, state } = input;
      const cookies = parseCookies(
        honoContext.req.raw.headers.get("Cookie") ?? "",
      );
      const stateCookie = cookies.get("github_oauth_state") ?? null;

      //   const url = new URL(honoContext.req.url);
      //   const state = url.searchParams.get("state");
      //   const code = url.searchParams.get("code");

      console.log("code", code);
      console.log("state", state);
      console.log("stateCookie", stateCookie);
      if (!state || !stateCookie || !code || stateCookie !== state) {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      try {
        const tokens = await github.validateAuthorizationCode(code);
        const githubUserResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        });
        const githubUser: GitHubUser = (await githubUserResponse.json()) as any;

        const existingAccount = await ctx.db.query.accounts.findFirst({
          where: eq(accounts.githubId, githubUser.id),
        });

        if (existingAccount) {
          const session = await lucia.createSession(existingAccount.userId, {});
          const sessionCookie = lucia.createSessionCookie(session.id);

          honoContext.header("Set-Cookie", sessionCookie.serialize());
          // await setSession(existingAccount.userId);
          return {
            success: true,
            userId: existingAccount.userId,
            isNewUser: false,
          };
        }

        if (!githubUser.email) {
          const githubUserEmailResponse = await fetch(
            "https://api.github.com/user/emails",
            {
              headers: {
                Authorization: `Bearer ${tokens.accessToken}`,
              },
            },
          );
          const githubUserEmails =
            (await githubUserEmailResponse.json()) as Email[];

          githubUser.email = getPrimaryEmail(githubUserEmails);
        }

        // const [user] = await ctx.db.insert(users).values({email: githubUser.email}).returning()
        return await db.transaction(async (tx) => {
          const [newUser] = await tx
            .insert(users)
            .values({
              email: githubUser.email,
            })
            .returning();

          await tx.insert(accounts).values({
            userId: newUser.id,
            accountType: "github",
            githubId: githubUser.id,
          });

          await tx.insert(profiles).values({
            userId: newUser.id,
            displayName: githubUser.login,
            image: githubUser.avatar_url,
          });

          const session = await lucia.createSession(newUser.id, {});
          const sessionCookie = lucia.createSessionCookie(session.id);

          honoContext.header("Set-Cookie", sessionCookie.serialize());

          return {
            success: true,
            userId: newUser.id,
            isNewUser: true,
          };
        });
      } catch (e) {
        if (e instanceof OAuth2RequestError) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid OAuth credentials",
          });
        }
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
} satisfies TRPCRouterRecord;

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}
