// import { createFileRoute, redirect } from "@tanstack/react-router";

// const isAuthenticated = () => false;

// export const Route = createFileRoute("/_auth")({
//   beforeLoad: async ({ location }) => {
//     if (!isAuthenticated()) {
//       throw redirect({
//         to: "/signup",
//         search: {
//           // Use the current location to power a redirect after login
//           // (Do not use `router.state.resolvedLocation` as it can
//           // potentially lag behind the actual current location)
//           redirect: location.href,
//         },
//       });
//     }
//   },
// });
