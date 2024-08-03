// import { authRouter } from "./router/auth";
// import { postRouter } from "./router/post";
import { helloRouter } from "./router/hello";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  //   auth: authRouter,
  //   post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
