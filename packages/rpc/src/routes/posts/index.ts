import { Hono } from "hono";
import type { Context } from "../../lib/context";

const app = new Hono<Context>()
  .get("/", async (c) => {
    const user = c.get("user");
    const session = c.get("session");
    return c.json({ user, session });
  })
  .get("/hello", async (c) => {
    return c.json({ message: "hello" });
  });

export default app;
