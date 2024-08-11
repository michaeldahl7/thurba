import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";
import { generateState } from "arctic";
import { github } from "@acme/auth";
import { serializeCookie } from "oslo/cookie";
import { desc, eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { hash } from "@node-rs/argon2";
import { publicProcedure } from "../trpc"; //protectedProcedure,

export const authRouter = {
  loginGithub: publicProcedure.query(async () => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    // Return the URL and state, we'll handle the response in the Hono route
    return { url: url.toString(), state };
  }),
} satisfies TRPCRouterRecord;
