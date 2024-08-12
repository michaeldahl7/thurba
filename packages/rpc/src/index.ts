import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { lucia, validateRequest } from "@acme/auth";
import type { Context } from "./lib/context.js";
import login from "./routes/login/github.js";
import { hc } from "hono/client";
import { env } from "../env";

const app = new Hono<Context>().basePath("/api");

app.use(csrf());

app.use("*", async (c, next) => {
  const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
  const { user, session } = await validateRequest(sessionId);
  c.set("user", user);
  c.set("session", session);
  await next();
});

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

const routes = app.route("/login", login);

// app.get("/protected", async (c) => {
//   const user = c.get("user");
//   if (!user) {
//     return c.json({ error: "Authentication required" }, 401);
//   }
//   return c.json({ message: "This is protected data", user });
// });
const client = hc<AppType>(env.HOST_NAME);

export { app, client };
export type AppType = typeof routes;
