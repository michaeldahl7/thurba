import { lucia } from "@acme/auth";
import { eq } from "@acme/db";
import { users } from "@acme/db/schema";
import { TRPCError } from "@trpc/server";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

const userInputSchema = z.object({
  id: z.number(),
});

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = {
  profile: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
    });
  }),
  updateProfile: protectedProcedure
    .input(userInputSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .update(users)
        .set(input)
        .where(eq(users.id, ctx.session.user.id));
    }),

  sessions: protectedProcedure.query(async ({ ctx }) => {
    return lucia.getUserSessions(ctx.session.user.id);
  }),

  deleteSession: protectedProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userSessions = await lucia.getUserSessions(ctx.session.user.id);

      if (userSessions.find((ele) => ele.id === input.sessionId)) {
        return await lucia.invalidateSession(input.sessionId);
      } else {
        throw new TRPCError({ code: "BAD_REQUEST" });
      }
    }),
} satisfies TRPCRouterRecord;
