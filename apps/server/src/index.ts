import { serve } from "@hono/node-server";
import { getCookie, setCookie } from "hono/cookie";

import { lucia } from "@acme/auth";
import { github } from "@acme/auth"; //validateRequest,
import { Hono } from "hono";

import { getAccountByGithubId } from "../data-access/accounts";

import { OAuth2RequestError, generateState } from "arctic";
import { createGithubUserUseCase } from "../use-cases/users";
import { env } from "../env";

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

import { appRouter, createTRPCContext } from "@acme/api";
import type { AuthResponse, Session, User } from "@acme/auth";
import { trpcServer } from "@hono/trpc-server";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

import type { Env } from "hono";

export interface Context extends Env {
  Variables: {
    user: User | null;
    session: Session | null;
    auth: AuthResponse;
  };
}
const FRONTEND_URL = env.FRONTEND_URL;

const app = new Hono<Context>();

app.use(
  cors({
    origin: FRONTEND_URL, // Your frontend URL
    credentials: true,
  }),
);
app.use(csrf());

app.use("*", async (c, next) => {
  let authResponse: AuthResponse;

  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    authResponse = { user: null, session: null };
    c.set("auth", authResponse);
    return next();
  }
  const result = await lucia.validateSession(sessionId);
  if (result.session?.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header(
      "Set-Cookie",
      lucia.createSessionCookie(result.session.id).serialize(),
      {
        append: true,
      },
    );
  }
  if (!result.session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  authResponse = result;
  c.set("auth", authResponse);
  return next();
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (opts, honoContext) => {
      const auth = honoContext.get("auth") as AuthResponse;
      console.log("auth in create context", auth);
      return await createTRPCContext({
        honoContext,
        session: auth,
      });
    },
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  }),
);

app.get("/login/github", async (c) => {
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
});
app.get("/github/callback", async (c) => {
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
      const session = await lucia.createSession(existingAccount.userId, {});
      c.header(
        "Set-Cookie",
        lucia.createSessionCookie(session.id).serialize(),
        { append: true },
      );

      return c.redirect(`${FRONTEND_URL}`);
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

    const session = await lucia.createSession(userId, {});
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
    return c.redirect(`${FRONTEND_URL}`);
  } catch (e) {
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      return c.body(null, 400);
    }
    return c.body(null, 500);
    // Redirect to frontend with an error parameter
  }
});

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}

// const routes = app
//   .route("/login", login)
//   .route("/logout", logout)
//   .route("/getSession", getSession)
//   .route("/posts", posts);

// export type AppType = typeof routes;

serve(app);

export { app };
