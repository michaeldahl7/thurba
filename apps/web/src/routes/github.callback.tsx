import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { trpc } from "../router";
// import { trpc } from "../router";

export const Route = createFileRoute("/github/callback")({
  component: GitHubCallbackHandler,
});

export function GitHubCallbackHandler() {
  const navigate = useNavigate();

  const githubCallbackMutation = trpc.auth.githubCallback.useMutation({
    onSuccess: (data) => {
      console.log("GitHub authentication successful:", data);
      navigate({ to: "/dashboard" });
    },
    onError: (error) => {
      console.error("GitHub authentication failed:", error);
      navigate({ to: "/login" });
    },
  });

  // Extract code and state from URL
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  // Trigger the mutation immediately if code and state are present
  if (code && state) {
    githubCallbackMutation.mutate({ code, state });
  } else {
    console.error("Missing code or state");
    navigate({ to: "/login" });
  }

  if (githubCallbackMutation.isPending) {
    return <div>Completing your sign-in...</div>;
  }

  // This will only be reached if there's an error in extracting code/state
  return null;
}
