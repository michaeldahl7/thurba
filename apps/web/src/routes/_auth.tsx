import { createFileRoute, redirect } from "@tanstack/react-router";
import { client } from "../utils/hono";

// Define types for the auth response
interface AuthResponse {
  user: { id: string } | null;
  session: { id: string } | null;
}

// Separate the auth check into its own function
async function checkAuth(): Promise<boolean> {
  try {
    const res = await client.api.auth.$get();
    if (!res.ok) {
      console.error("Auth request failed:", res.status, res.statusText);
      return false;
    }
    const data: AuthResponse = await res.json();
    return !!data.user;
  } catch (error) {
    console.error("Error checking auth:", error);
    return false;
  }
}

export const Route = createFileRoute("/_auth")({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});
