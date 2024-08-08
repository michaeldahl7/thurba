import { Link } from "@tanstack/react-router";

const link = <Link to="/about">About</Link>;

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/signin")({
  component: () => <div>Sign in with github </div>,
});
