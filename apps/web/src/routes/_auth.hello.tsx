import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth/hello")({
  component: () => <div>Hello /_auth/hello!</div>,
});
