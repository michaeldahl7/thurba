// import { authRouter } from "./router/auth";
// import { postRouter } from "./router/post";
import { posts } from "@acme/db/schema";
import { helloRouter } from "./router/hello";
import { postRouter } from "./router/post";
import { authRouter } from "./router/auth";

import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  hello: helloRouter,
  post: postRouter,
  auth: authRouter,
  //   post: postRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
