import { app } from "@acme/rpc";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import { cors } from "hono/cors";
// const app = new Hono();

import { appRouter, createTRPCContext } from "@acme/api";
import { trpcServer } from "@hono/trpc-server";

// app.use(cors());
// app.use(csrf());

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: async (opts, c) => {
      const headers = new Headers(c.req.raw.headers);
      const session = null;
      return await createTRPCContext({ headers, session: session });
    },
  }),
);

serve(app);
