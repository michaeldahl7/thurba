import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

import { env as authEnv } from "@acme/auth/env";
import { env as dbEnv } from "@acme/db/env";

export const env = createEnv({
  extends: [dbEnv, authEnv],
  shared: {
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
  },
  server: {},
  runtimeEnv: process.env,
  skipValidation:
    !!process.env.CI || process.env.npm_lifecycle_event === "lint",
});
