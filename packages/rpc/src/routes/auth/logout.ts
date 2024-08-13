import { lucia } from "@acme/auth"; //validateRequest,
import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";

import type { Context } from "../../lib/context";

const app = new Hono<Context>().post("/", async (c) => {
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

export default app;
