import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { db } from "@acme/db/client";

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
});

const app = new Hono()
  .get("/", async (c) => {
    const data = await db.query.UserTable.findMany();

    return c.json({ data });
    // return c.json("list users");
  })
  .post("/", zValidator("json", userSchema), (c) => {
    const data = c.req.valid("json");

    return c.json("create a user", 201, data);
  })
  .get("/:id", zValidator("param", z.object({ id: z.string() })), (c) => {
    return c.json(`get ${c.req.param("id")}`);
  });

export default app;
