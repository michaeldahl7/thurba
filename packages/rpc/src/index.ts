import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { lucia, validateRequest } from "@acme/auth";
import { cors } from "hono/cors";
import type { Context } from "./lib/context";
import login from "./routes/login/github";
import logout from "./routes/auth/logout";
import getSession from "./routes/auth/getSession";

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
  .route("/getSession", getSession);

export { app };
export type AppType = typeof routes;
