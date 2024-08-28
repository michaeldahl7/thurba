import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

// import { env as authEnv } from "@acme/auth/env";
// import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {
    FRONTEND_URL: z.string().min(1),
    BACKEND_URL: z.string().min(1),
  },
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
