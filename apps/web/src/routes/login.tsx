import { createFileRoute, useRouter } from "@tanstack/react-router";

import { z } from "zod";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginComponent,
});

function LoginComponent() {
  return <div>Loginsz</div>;
}
