import { Button } from "@acme/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";
import { trpc } from "../router";

const fallback = "/dashboard" as const;

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: async ({ context, search }) => {
    const session = await context.trpcQueryUtils.auth.getAuth.ensureData();

    if (session.session !== null) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: Login,
});

function Login() {
  const search = Route.useSearch();
  const loginMutation = trpc.auth.githubLogin.useMutation({
    onSuccess: (data) => {
      window.location.href = data.url;
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });

  const isLoading = loginMutation.isPending || loginMutation.isSuccess;

  return (
    <div className="p-2 grid gap-2 place-items-center">
      <h3 className="text-xl">Login page</h3>
      {search.redirect ? (
        <p className="text-red-500">You need to login to access this page.</p>
      ) : (
        <p>Login to see all the cool content in here.</p>
      )}
      <Button onClick={() => loginMutation.mutate()} disabled={isLoading}>
        {isLoading ? (
          <>
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : (
          "Login with GitHub"
        )}
      </Button>
    </div>
  );
}
