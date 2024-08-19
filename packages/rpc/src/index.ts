import { lucia, validateRequest } from "@acme/auth";
import { Hono } from "hono";
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
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  const { user, session } = await validateRequest(sessionId);
  if (session?.fresh) {
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
  await next();
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
