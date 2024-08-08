import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@acme/db/client";
import type { Context } from "../../lib/context";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const app = new Hono<Context>().get("/", async (c) => {
  const user = c.get("user");
  const session = c.get("session");
  return c.json({ user, session });
  // return c.json("list users");
});
//   .post("/", zValidator("json", userSchema), (c) => {
//     const data = c.req.valid("json");

//     return c.json("create a user", 201, data);
//   })
//   .get("/:id", zValidator("param", z.object({ id: z.string() })), (c) => {
//     return c.json(`get ${c.req.param("id")}`);
//   });

export default app;
