import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { CreatePostSchema, Post } from "@acme/db/schema";

import {  publicProcedure } from "../trpc"; //protectedProcedure,

export const helloRouter = {
  hello: publicProcedure.query(({ ctx }) => {
    return "hello";
	}),
	get: publicProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
		return (`hello ${input.id}`);
	}),
} satisfies TRPCRouterRecord;

// export const postRouter = {
//   all: publicProcedure.query(({ ctx }) => {
//     // return ctx.db.select().from(schema.post).orderBy(desc(schema.post.id));
//     return ctx.db.query.Post.findMany({
//       orderBy: desc(Post.id),
//       limit: 10,
//     });
//   }),

//   byId: publicProcedure
//     .input(z.object({ id: z.string() }))
//     .query(({ ctx, input }) => {
//       // return ctx.db
//       //   .select()
//       //   .from(schema.post)
//       //   .where(eq(schema.post.id, input.id));

//       return ctx.db.query.Post.findFirst({
//         where: eq(Post.id, input.id),
//       });
//     }),

//   create: protectedProcedure
//     .input(CreatePostSchema)
//     .mutation(({ ctx, input }) => {
//       return ctx.db.insert(Post).values(input);
//     }),

//   delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
//     return ctx.db.delete(Post).where(eq(Post.id, input));
//   }),
// } satisfies TRPCRouterRecord;
