import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { lucia, validateRequest, github, google } from "@acme/auth";
import { database } from "@acme/db/client";
import { users } from "@acme/db/schema";
import { eq } from "drizzle-orm";

import type { Context } from "./lib/context.js";

const app = new Hono<Context>();

app.use("*", async (c, next) => {
  const sessionId = getCookie(c, lucia.sessionCookieName);
  const { user, session } = await validateRequest(sessionId);
  c.set("user", user);
  c.set("session", session);
  await next();
});

app.get("/api/me", async (c) => {
  const user = c.get("user");
  if (!user) return c.json(null, 401);
  return c.json(user);
});

app.get("/api/login/github", async (c) => {
  const [url, state] = await github.createAuthorizationURL();
  setCookie(c, "github_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  return c.redirect(url.toString());
});

app.get("/api/login/github/callback", async (c) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const storedState = getCookie(c, "github_oauth_state");

  if (!code || !state || !storedState || state !== storedState) {
    return c.text("Invalid state", 400);
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const githubUser = await github.getUser(tokens.accessToken);
    const existingUser = await database
      .select()
      .from(users)
      .where(eq(users.githubId, githubUser.id))
      .limit(1);

    let userId: string;
    if (existingUser.length > 0) {
      userId = existingUser[0].id;
    } else {
      const newUser = await database
        .insert(users)
        .values({
          username: githubUser.login,
          githubId: githubUser.id,
        })
        .returning({ id: users.id });
      userId = newUser[0].id;
    }

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    setCookie(
      c,
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return c.redirect("/dashboard");
  } catch (e) {
    return c.text("Authentication failed", 400);
  }
});

app.post("/api/logout", async (c) => {
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

app.get("/api/protected", async (c) => {
  const user = c.get("user");
  if (!user) {
    return c.json({ error: "Authentication required" }, 401);
  }
  return c.json({ message: "This is protected data", user });
});

export type AppType = typeof app;
export default app;
