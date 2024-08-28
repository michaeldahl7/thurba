import { authRouter } from "./router/auth";
import { postRouter } from "./router/post";
import { userRouter } from "./router/user";

import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  user: userRouter,
  post: postRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
