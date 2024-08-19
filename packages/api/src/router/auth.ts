// import { github } from "@acme/auth";
// import { desc, eq } from "@acme/db";
// import { users } from "@acme/db/schema";
// import { hash } from "@node-rs/argon2";
// import type { TRPCRouterRecord } from "@trpc/server";
import { generateState } from "arctic";
import { OAuth2RequestError } from "arctic";
// import { serializeCookie } from "oslo/cookie";
// import { z } from "zod";
// import { publicProcedure } from "../trpc"; //protectedProcedure,

// export const authRouter = {
//   loginGithub: publicProcedure.query(async () => {
//     const state = generateState();
//     const url = await github.createAuthorizationURL(state);

//     // Return the URL and state, we'll handle the response in the Hono route
//     return { url: url.toString(), state };
//   }),
// } satisfies TRPCRouterRecord;

import { TRPCError, type TRPCRouterRecord } from "@trpc/server";

import { github, invalidateSessionToken } from "@acme/auth";

import { protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const authRouter = {
  githubLogin: publicProcedure.query(async () => {
    const state = generateState();
    const url = await github.createAuthorizationURL(state);

    // Return the URL and state, we'll handle the response in the Hono route
    return { url: url.toString(), state };
  }),
  //   handleGithubCallback: publicProcedure
  //   .input(z.object({ code: z.string(), state: z.string() }))
  //   .mutation(async ({ input }) => {
  // 	try {
  // 	  const tokens = await github.validateAuthorizationCode(input.code)
  // 	  if (!input.code || !input.state || !storedState || input.state !== storedState) {
  // 		return new Response(null, {
  // 		  status: 400,
  // 		});
  // 	  // Fetch GitHub user info and handle user creation/login as in the original example
  // 	  // Return user info or session token
  // 	} catch (e) {
  // 	  if (e instanceof OAuth2RequestError) {
  // 		throw new TRPCError({
  // 		  code: 'BAD_REQUEST',
  // 		  message: 'Invalid OAuth callback'
  // 		})
  // 	  }
  // 	  throw new TRPCError({
  // 		code: 'INTERNAL_SERVER_ERROR',
  // 		message: 'Something went wrong'
  // 	  })
  // 	}
  //   }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
  signOut: protectedProcedure.mutation(async (opts) => {
    if (!opts.ctx.session) {
      return { success: false };
    }
    await invalidateSessionToken(opts.ctx.session.id);
    return { success: true };
  }),
} satisfies TRPCRouterRecord;
