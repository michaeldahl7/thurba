import { Outlet, createFileRoute } from "@tanstack/react-router";
import { trpc } from "../router";
import { LoginPage } from "./login"; // Import the LoginPage component

export const Route = createFileRoute("/_auth")({
  component: AuthenticatedLayout,
  loader: async ({ context: { trpcQueryUtils } }) => {
    await trpcQueryUtils.auth.getSession.ensureData();
    return;
  },
});

function AuthenticatedLayout() {
  const { data: session, isLoading } = trpc.auth.getSession.useQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!session?.user) {
    return <LoginPage />;
  }

  return <Outlet />;
}
