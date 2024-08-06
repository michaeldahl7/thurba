import { createLazyFileRoute } from "@tanstack/react-router";
import { api } from "../utils/api";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const { data } = api.hello.get.useQuery({ id: "world" });

  return (
    <div className="p-2">
      <h3>Welcome Home! {data}</h3>
    </div>
  );
}
