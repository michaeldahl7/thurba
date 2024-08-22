import { Outlet, createFileRoute } from '@tanstack/react-router';
import { trpc } from '../utils/trpc';
import { LoginPage } from './login'; // Import the LoginPage component

export const authenticatedRoute = createFileRoute('/_authenticated')({
  component: AuthenticatedLayout,
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