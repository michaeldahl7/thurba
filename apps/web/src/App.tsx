import {
  RouterProvider,
  createRouter,
  ErrorComponent,
} from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
// import { TRPCProvider } from "./utils/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { AuthClient } from "./auth/AuthClient";
import { Spinner } from "./components/Spinner";
// import { queryClient } from "./utils/queryClient";
// Create a new router instance
export const queryClient = new QueryClient();
// const authClient = new AuthClient();

const router = createRouter({
  routeTree,
  defaultPendingComponent: () => (
    <div className={"p-2 text-2xl"}>
      <Spinner />
    </div>
  ),
  defaultErrorComponent: ({ error }) => <ErrorComponent error={error} />,
  defaultPreload: "intent",
  context: {
    queryClient,
  },
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

// <TRPCProvider>
export default App;
