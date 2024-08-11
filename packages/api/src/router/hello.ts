import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { hash } from "@node-rs/argon2";
import { publicProcedure } from "../trpc"; //protectedProcedure,

const usernameSchema = z.string();
//   .min(3, "Username must be at least 3 characters long")
//   .max(30, "Username must not exceed 30 characters")
//   .regex(
//     /^[a-zA-Z0-9_]+$/,
//     "Username can only contain letters, numbers, and underscores",
//   );

const passwordSchema = z.string();
//   .min(8, "Password must be at least 8 characters long")
//   .max(72, "Password must not exceed 72 characters")
//   .regex(
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
//     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
//   );

export const helloRouter = {
  hello: publicProcedure.query(({ ctx }) => {
    return "hello";
  }),
  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return `hello ${input.id}`;
    }),
  //   signup: publicProcedure
  //     .input(
  //       z.object({
  //         username: usernameSchema,
  //         password: passwordSchema,
  //       }),
  //     )
  //     .mutation(async ({ ctx, input }) => {
  //       const passwordHash = await hash(input.password, {
  //         // recommended minimum parameters
  //         memoryCost: 19456,
  //         timeCost: 2,
  //         outputLen: 32,
  //         parallelism: 1,
  //       });
  //       const user = await ctx.database.insert(users).values({
  //         name: input.username,
  //         password_hash: passwordHash,
  //       });
  //       return user;
  //     }),
} satisfies TRPCRouterRecord;
