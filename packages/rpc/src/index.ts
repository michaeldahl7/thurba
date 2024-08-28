import { lucia, validateRequest } from "@acme/auth";
import { Hono } from "hono";
import { getCookie } from "hono/cookie";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import type { Context } from "./lib/context";
import getSession from "./routes/auth/getSession";
import logout from "./routes/auth/logout";
import login from "./routes/login/github";
import posts from "./routes/posts";

const app = new Hono<Context>();

app.use(cors());
app.use(csrf());

app.use("*", async (c, next) => {
  //   const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  const sessionId = getCookie(c, lucia.sessionCookieName) ?? null;

  if (!sessionId) {
    c.set("user", null);
    c.set("session", null);
    return next();
  }
  const { user, session } = await validateRequest(sessionId);
  if (!session) {
    c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
      append: true,
    });
  }
  if (session?.fresh) {
    c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
      append: true,
    });
  }

  c.set("user", user);
  c.set("session", session);
  await next();
});

app
  .get("/getSession", async (c) => {
    const user = c.get("user");
    const session = c.get("session");
    return c.json({ user, session });
  })
  .get("/protected", async (c) => {
    const user = c.get("user");
    if (!user) {
      return c.json({ error: "Authentication required" }, 401);
    }
    return c.json({ user });
  });
// app.get("/protected", async (c) => {
//   const user = c.get("user");
//   if (!user) {
//     return c.json({ error: "Authentication required" }, 401);
//   }
//   return c.json({ user });
// });

// Add this new route for checking authentication status

const routes = app
  .route("/login", login)
  .route("/logout", logout)
  .route("/getSession", getSession)
  .route("/posts", posts);

export { app };
export type AppType = typeof routes;
