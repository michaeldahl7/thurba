import { Hono } from "hono";
import type { Context } from "../../lib/context";

const app = new Hono<Context>()
  .get("/", async (c) => {
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
  })
  .get("/hello", async (c) => {
    return c.text("Hello Hono!");
  });

export default app;
