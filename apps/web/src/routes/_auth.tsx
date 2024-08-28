import { Button } from "@acme/ui/button";
import {
  Outlet,
  createFileRoute,
  redirect,
  useRouter,
} from "@tanstack/react-router";

import { trpc, trpcQueryUtils } from "../router";

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location, context }) => {
    const session = await context.trpcQueryUtils.auth.getAuth.ensureData();
    console.log("session", session.session);
    if (session.session === null) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
    // Optionally, you can return the session data if needed in the component
  },

  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const router = useRouter();

  //   const { data: authData, isLoading } = trpc.auth.getSession.useQuery();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Optionally, you can invalidate and refetch the session query here
      trpcQueryUtils.auth.getAuth.invalidate();
      router.navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Logout error:", error);
      // Handle error (e.g., show an error message to the user)
    },
  });

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  //   if (!authData || !authData.user) {
  //     return <Login />;
  //   }

  return (
    <div>
      <div>
        <Button
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
      <Outlet />
    </div>
  );
}
