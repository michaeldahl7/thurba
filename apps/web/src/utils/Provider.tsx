// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { httpBatchLink, loggerLink } from "@trpc/client";
// import { createTRPCReact } from "@trpc/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import superjson from "superjson";
// import type { AppRouter } from "@acme/api";
// export { type RouterInputs, type RouterOutputs } from "@acme/api";
// export const api = createTRPCReact<AppRouter>();

// export function TRPCProvider(props: { children: React.ReactNode }) {
//   const queryClient = new QueryClient();
//   const trpcClient = api.createClient({
//     links: [
//       loggerLink({
//         enabled: (opts) =>
//           process.env.NODE_ENV === "development" ||
//           (opts.direction === "down" && opts.result instanceof Error),
//         colorMode: "ansi",
//       }),
//       httpBatchLink({
//         url: "http://localhost:3000/trpc",
//         transformer: superjson,
//         headers() {
//           const headers = new Map<string, string>();
//           headers.set("x-trpc-source", "vite-react");

//           // const token = getToken();
//           const token = 1234;
//           if (token) headers.set("Authorization", `Bearer ${token}`);

//           return Object.fromEntries(headers);
//         },
//       }),
//     ],
//   });

//   return (
//     <api.Provider client={trpcClient} queryClient={queryClient}>
//       <QueryClientProvider client={queryClient}>
//         {props.children}
//       </QueryClientProvider>
//     </api.Provider>
//   );
// }
