import { Hono } from "hono";

import users from "./routes/users";
import getAuth from "./routes/auth/getAuth";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";

import { getCookie } from "hono/cookie";
import type { Context } from "./lib/context.js";
import { lucia } from "./lib/auth.js";
import { githubLoginRouter } from "./routes/login/github";

const app = new Hono<Context>().basePath("/api");
app.use(cors());
app.use(csrf());

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;
  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { session, user } = await lucia.validateSession(sessionId);
  if (session?.fresh) {
    // use `header()` instead of `setCookie()` to avoid TS errors
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  c.set("user", user);
  c.set("session", session);
  return next();
});
const routes = app
  .route("/users", users)
  .route("/auth", getAuth)
  .route("/login/github", githubLoginRouter);
//   .route("/login/github", githubLoginRouter);

export { app };
export type AppType = typeof routes;
