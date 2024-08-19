import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

// import { posts } from "@acme/db/schema";
import { publicProcedure } from "../trpc"; //protectedProcedure,

const POSTS = [
  { id: "1", title: "First post" },
  { id: "2", title: "Second post" },
  { id: "3", title: "Third post" },
  { id: "4", title: "Fourth post" },
  { id: "5", title: "Fifth post" },
  { id: "6", title: "Sixth post" },
  { id: "7", title: "Seventh post" },
  { id: "8", title: "Eighth post" },
  { id: "9", title: "Ninth post" },
  { id: "10", title: "Tenth post" },
];

export const postRouter = {
  posts: publicProcedure.query(async (_) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return POSTS;
  }),
  post: publicProcedure.input(String).query(async (req) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return POSTS.find((p) => p.id === req.input);
  }),
} satisfies TRPCRouterRecord;
