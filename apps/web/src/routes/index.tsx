import { createFileRoute } from "@tanstack/react-router";
// import { api } from "../utils/api";
import { useGetUsers } from "../utils/use-get-users";

export const Route = createFileRoute("/")({
  component: Page,
});

export function Page() {
  const { data: users, isLoading } = useGetUsers();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  // This can either be a tuple ['login'] or string 'login'

  return (
    <div className="p-2">
      <h3>Welcome Home! </h3>
      {/* <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.id}</li>
        ))}
      </ul> */}
    </div>
  );
}
