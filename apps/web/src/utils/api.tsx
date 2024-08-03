import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import superjson from "superjson";
import type { AppRouter } from "@acme/api";
export { type RouterInputs, type RouterOutputs } from "@acme/api";
export const api = createTRPCReact<AppRouter>();

export function TRPCProvider(props: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  const trpcClient = api.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/trpc",
        transformer: superjson,
      }),
    ],
  });

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {props.children}
      </QueryClientProvider>
    </api.Provider>
  );
}

// biome-ignore lint/complexity/noUselessLoneBlockStatements: <explanation>
{
  /* <api.Provider client={trpcClient} queryClient={queryClient}>
<QueryClientProvider client={queryClient}>
  {props.children}
</QueryClientProvider>
</api.Provider> */
}
