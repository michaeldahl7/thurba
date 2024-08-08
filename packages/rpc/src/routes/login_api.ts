// import { Hono } from "hono";
// import { z } from "zod";
// import { zValidator } from "@hono/zod-validator";
// import { db } from "@acme/db/client";
// import { getCookie } from "hono/cookie";

// import type { Context } from "../lib/context";
// import { lucia } from "../lib/auth";

// const app = new Hono<Context>().get("/", async (c, next) => {
//   const sessionId = lucia.readSessionCookie(c.req.header("Cookie") ?? "");
//   if (!sessionId) {
//     // c.set("user", null);
//     // c.set("session", null);
//     return c.json({ user: null, session: null });
//   }

//   const { session, user } = await lucia.validateSession(sessionId);
//   if (session?.fresh) {
//     c.header("Set-Cookie", lucia.createSessionCookie(session.id).serialize(), {
//       append: true,
//     });
//   }
//   if (!session) {
//     c.header("Set-Cookie", lucia.createBlankSessionCookie().serialize(), {
//       append: true,
//     });
//   }
//   c.set("user", user);
//   c.set("session", session);
//   return next();
// });

// export default app;
