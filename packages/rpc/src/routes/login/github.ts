import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { lucia, github } from "@acme/auth"; //validateRequest,
import { setSession } from "@acme/auth/sessions";

import { getAccountByGithubId } from "../../data-access/accounts";

import type { Context } from "../../lib/context";
import { generateState, OAuth2RequestError } from "arctic";
import { createGithubUserUseCase } from "../../use-cases/users";

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

const app = new Hono<Context>()
  .get("/github", async (c) => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);
    setCookie(c, "github_oauth_state", state, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 60 * 10,
      sameSite: "Lax",
    });
    return c.redirect(url.toString());
  })
  .get("/github/callback", async (c) => {
    const code = c.req.query("code")?.toString() ?? null;
    const state = c.req.query("state")?.toString() ?? null;
    const storedState = getCookie(c).github_oauth_state ?? null;
    if (!code || !state || !storedState || state !== storedState) {
      return c.body(null, 400);
    }
    try {
      const tokens = await github.validateAuthorizationCode(code);
      const githubUserResponse = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      });
      const githubUser: GitHubUser = (await githubUserResponse.json()) as any;
      const existingAccount = await getAccountByGithubId(githubUser.id);
      if (existingAccount) {
        await setSession(existingAccount.userId);

        return c.redirect("/");
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

      const userId = await createGithubUserUseCase(githubUser);

      await setSession(userId);
      return c.redirect("/");
    } catch (e) {
      if (
        e instanceof OAuth2RequestError &&
        e.message === "bad_verification_code"
      ) {
        // invalid code
        return c.body(null, 400);
      }
      return c.body(null, 500);
    }
  })
  .post("/api/logout", async (c) => {
    const sessionId = getCookie(c, lucia.sessionCookieName);
    if (sessionId) {
      await lucia.invalidateSession(sessionId);
    }
    const sessionCookie = lucia.createBlankSessionCookie();
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return c.json({ success: true });
  });

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}

export default app;
