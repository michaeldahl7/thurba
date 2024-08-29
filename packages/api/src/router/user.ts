// import { lucia } from "@acme/auth";
// import { eq } from "@acme/db";
// import { users, profiles } from "@acme/db/schema";
// import { TRPCError } from "@trpc/server";
// import type { TRPCRouterRecord } from "@trpc/server";
// import { z } from "zod";

// import { protectedProcedure } from "../trpc";

// export const userRouter = {
//   profile: protectedProcedure.query(({ ctx }) => {
//     return ctx.db.query.users.findFirst({
//       where: eq(users.id, ctx.auth.user.id),
//     });
//   }),
// } satisfies TRPCRouterRecord;
