// import { createEnv } from "@t3-oss/env-core";
// import { z } from "zod";

// // import { env as authEnv } from "@acme/auth/env";
// // import { env as dbEnv } from "@acme/db/env";

// export const env = createEnv({
//   //   extends: [dbEnv, authEnv],

//   shared: {
//     NODE_ENV: z
//       .enum(["development", "production", "test"])
//       .default("development"),
//     HOST_NAME: z.string(),
//   },
//   clientPrefix: "VITE_",
//   client: {
//     VITE_API_URL: z.string().url(),
//   },
//   runtimeEnv: import.meta.env,
//   skipValidation:
//     !!import.meta.env.CI || import.meta.env.npm_lifecycle_event === "lint",
// });
