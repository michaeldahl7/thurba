import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Link,
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
// import type { AuthClient } from "../auth/AuthClient";
import { Spinner } from "../components/Spinner";

function RouterSpinner() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return <Spinner show={isLoading} />;
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});

// });

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Homes
        </Link>{" "}
      </div>
      <hr />
      <div className={"text-3xl"}>
        <RouterSpinner />
      </div>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
