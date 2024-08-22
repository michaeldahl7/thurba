import { createFileRoute } from "@tanstack/react-router";

import { trpc } from "../router";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

export function LoginPage() {
  const { data } = trpc.auth.getSecretMessage.useQuery();
  const githubLoginMutation = trpc.auth.githubLogin.useMutation();

  const initiateGithubLogin = async () => {
    try {
      const { url } = await githubLoginMutation.mutateAsync();
      window.location.href = url; // Redirect to GitHub
    } catch (error) {
      console.error("Failed to initiate GitHub login", error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <h3>Secret message: {data}</h3>
      <button onClick={initiateGithubLogin}>Sign in with GitHub</button>
    </div>
  );
}
