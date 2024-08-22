import { createFileRoute } from '@tanstack/react-router';

import { trpc } from '../router';

export const loginRoute = createFileRoute('/login')({
  component: LoginPage,
});

export function LoginPage() {

  const githubLoginMutation = trpc.auth.githubLogin.useMutation();

  const initiateGithubLogin = async () => {
    try {
      const { url } = await githubLoginMutation.mutateAsync();
      window.location.href = url; // Redirect to GitHub
    } catch (error) {
      console.error('Failed to initiate GitHub login', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={initiateGithubLogin}>Sign in with GitHub</button>
    </div>
  );
}