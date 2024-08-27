import { createFileRoute, useSearch } from "@tanstack/react-router";
import { trpc } from "../router";
import { z } from "zod";

export const Route = createFileRoute("/github/callback")({
  validateSearch: z.object({
    code: z.string(),
    state: z.string(),
  }),
  component: GitHubCallbackHandlerComponent,
  //   loaderDeps: ({ search: { code, state } }) => ({
  //     code,
  //     state,
  //   }),
  //   loader: (opts) => {
  // 	opts.context.trpcQueryUtils.auth.
  //   loader: ({ deps: { code, state } }) => {
  //     return { code, state };
  //   },
});

function GitHubCallbackHandlerComponent() {
  const { code, state } = Route.useSearch();
  return (
    <div>
      Hello /github/callback! Code: {code}, State: {state}
    </div>
  );
}
