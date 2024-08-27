import { serve } from "@hono/node-server";
import { getCookie, setCookie } from "hono/cookie";
import { validateRequest } from "@acme/auth";
import { lucia } from "@acme/auth";
import { Hono } from "hono";
import { github } from "@acme/auth"; //validateRequest,
import { setSession } from "@acme/auth/sessions";

import { getAccountByGithubId } from "../data-access/accounts";

import { OAuth2RequestError, generateState } from "arctic";
import { createGithubUserUseCase } from "../use-cases/users";

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
import { trpcServer } from "@hono/trpc-server";
import type { User, Session, AuthResponse } from "@acme/auth";
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
const FRONTEND_URL = "http://localhost:5173";

const app = new Hono<Context>();

app.use(
  cors({
    origin: FRONTEND_URL, // Your frontend URL
    credentials: true,
  }),
);
app.use(csrf());

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  let authResponse: AuthResponse;

  if (!sessionId) {
    console.log("sessionId", sessionId);
    authResponse = { user: null, session: null };
  } else {
    const { user, session } = await validateRequest(sessionId);
    console.log("user", user);
    console.log("session", session);
    if (!session) {
      authResponse = { user: null, session: null };
      c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
        append: true,
      });
    } else {
      authResponse = { user, session };
      if (session.fresh) {
        c.header(
          "Set-Cookie",
          lucia.createSessionCookie(session.id).serialize(),
          {
            append: true,
          },
        );
      }
    }
  }
  console.log("authResponse:", authResponse);
  c.set("auth", authResponse);
  await next();
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (opts, honoContext) => {
      const auth = honoContext.get("auth") as AuthResponse;
      console.log("auth:", auth);
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

// app
//   .get("/getSession", async (c) => {
//     const user = c.get("user");
//     const session = c.get("session");
//     return c.json({ user, session });
//   })
//   .get("/protected", async (c) => {
//     const user = c.get("user");
//     if (!user) {
//       return c.json({ error: "Authentication required" }, 401);
//     }
//     return c.json({ user });
//   });
app.get("/", async (c) => {
  return c.text("Hello Hono!");
});
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

      return c.redirect(`${FRONTEND_URL}/auth-callback?success=true`);
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
    return c.redirect(`http://localhost:3000/?success=true`);
  } catch (e) {
    console.error("GitHub OAuth callback error:", e);
    // Redirect to frontend with an error parameter
    return c.redirect(`http://localhost:3000/?error=authentication_failed`);

    // if (e instanceof OAuth2RequestError) {
    //   if (e.message === "bad_verification_code") {
    //     return c.body("Invalid authorization code", 400);
    //   }
    //   return c.body(`OAuth2 error: ${e.message}`, 400);
    // }

    // if (e instanceof Error) {
    //   return c.body(`Internal server error: ${e.message}`, 500);
    // }

    // return c.body("An unexpected error occurred", 500);
  }
});

function getPrimaryEmail(emails: Email[]): string {
  const primaryEmail = emails.find((email) => email.primary);
  return primaryEmail!.email;
}
// app.get("/protected", async (c) => {
//   const user = c.get("user");
//   if (!user) {
//     return c.json({ error: "Authentication required" }, 401);
//   }
//   return c.json({ user });
// });

// Add this new route for checking authentication status

// const routes = app
//   .route("/login", login)
//   .route("/logout", logout)
//   .route("/getSession", getSession)
//   .route("/posts", posts);

// export type AppType = typeof routes;

serve(app);

export { app };
