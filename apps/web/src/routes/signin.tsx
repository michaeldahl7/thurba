// import { Link } from "@tanstack/react-router";

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: () => <div>Sign in with github </div>,
});
