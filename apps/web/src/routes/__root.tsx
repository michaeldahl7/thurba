import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  Link,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import type { QueryClient } from "@tanstack/react-query";

export const Route = createRootRouteWithContext<{
  // auth: Auth
  queryClient: QueryClient;
}>()({
  component: RootComponent,
});
// export const Route = createRootRoute({
//   component: () => (
//     <>
//       <div className="p-2 flex gap-2">
//         <Link to="/" className="[&.active]:font-bold">
//           Home
//         </Link>{" "}
//         <Link to="/about" className="[&.active]:font-bold">
//           About
//         </Link>
//       </div>
//       <hr />
//       <Outlet />
//       <ReactQueryDevtools buttonPosition="top-right" />
//       <TanStackRouterDevtools position="bottom-right" />
//     </>
//   ),
// });

function RootComponent() {
  return (
    <>
      <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>{" "}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}
