import { createFileRoute } from "@tanstack/react-router";
// import { api } from "../utils/api";
// import { useGetUsers } from "../utils/use-get-users";
import { getCurrentUser } from "../utils/getSession";

export const Route = createFileRoute("/")({
  component: Page,
});

export function Page() {
  //   const user = { id: "123" };
  const { data, isLoading } = getCurrentUser();
  //   const { data: users, isLoading } = useGetUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // This can either be a tuple ['login'] or string 'login'
  if (data?.user === null) {
    return <div>Login</div>;
  }
  return <div>Welcome, {data?.user.id}</div>;
}
