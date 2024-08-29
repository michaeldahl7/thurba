import { github, lucia } from "@acme/auth";
import type { TRPCRouterRecord } from "@trpc/server";
import { generateState } from "arctic";

import { protectedProcedure, publicProcedure } from "../trpc";

// import type { Session, User } from "lucia";
import { serializeCookie } from "oslo/cookie";
// import { z } from "zod";
// import { eq } from "@acme/db";
// import { accounts, profiles, users } from "@acme/db/schema";

export const authRouter = {
  getAuth: publicProcedure.query(({ ctx }) => {
    return ctx.auth;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    const auth = ctx.auth;
    if (!auth.session) {
      return {
        success: true,
      };
    }
    await lucia.invalidateSession(auth.session.id);
    ctx.honoContext.header(
      "Set-Cookie",
      lucia.createBlankSessionCookie().serialize(),
      {
        append: true,
      },
    );

    return { success: true };
  }),
  githubLogin: publicProcedure.mutation(async ({ ctx }) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    ctx.honoContext.req.raw.headers;

    ctx.honoContext.header(
      "Set-Cookie",
      serializeCookie("github_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10,
        path: "/",
      }),
    );

    return { url: url.toString() };
  }),
  sessions: protectedProcedure.query(async ({ ctx }) => {
    return lucia.getUserSessions(ctx.auth.user.id);
  }),

  //   deleteSession: protectedProcedure
  //     .input(z.object({ sessionId: z.string() }))
  //     .mutation(async ({ ctx, input }) => {
  //       const userSessions = await lucia.getUserSessions(ctx.auth.user.id);

  //       if (userSessions.find((ele) => ele.id === input.sessionId)) {
  //         return await lucia.invalidateSession(input.sessionId);
  //       } else {
  //         throw new TRPCError({ code: "BAD_REQUEST" });
  //       }
  //     }),
} satisfies TRPCRouterRecord;
