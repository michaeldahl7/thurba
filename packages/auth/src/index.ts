// import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
// import { Lucia } from "lucia";
// import { SessionTable, UserTable } from "@acme/db/schema";
// import { db } from "@acme/db/client";
// import { GitHub } from "arctic";

// import { z } from "zod";

// const envSchema = z.object({
//   GITHUB_CLIENT_ID: z.string(),
//   GITHUB_CLIENT_SECRET: z.string(),
// });

// const env = envSchema.parse(process.env);

// console.log("Github client id", env.GITHUB_CLIENT_ID);
// console.log("Github client secret", env.GITHUB_CLIENT_SECRET);

// export const github = new GitHub(
//   env.GITHUB_CLIENT_ID,
//   env.GITHUB_CLIENT_SECRET,
// );

// // const githubClientId = process.env.GITHUB_CLIENT_ID;
// // const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

// // console.log("githubClientId", githubClientId);
// // console.log("githubClientSecret", githubClientSecret);

// // export const github = new GitHub(githubClientId, githubClientSecret);

// export const adapter = new DrizzlePostgreSQLAdapter(
//   db,
//   SessionTable,
//   UserTable,
// );

// export const lucia = new Lucia(adapter, {
//   sessionCookie: {
//     attributes: {
//       secure: process.env.NODE_ENV === "production",
//     },
//   },
//   getUserAttributes: (attributes) => {
//     return {
//       githubId: attributes.github_id,
//       username: attributes.username,
//     };
//   },
// });

// // IMPORTANT!
// declare module "lucia" {
//   interface Register {
//     Lucia: typeof lucia;
//     DatabaseUserAttributes: {
//       github_id: number;
//       username: string;
//     };
//   }
// }

import { Lucia } from "lucia";
import type { User, Session } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { database } from "@acme/db/client";
import { GitHub, Google } from "arctic";
import { env } from "../env";
import type { UserId as CustomUserId } from "./types";
import { sessions, users } from "@acme/db/schema";

export const adapter = new DrizzlePostgreSQLAdapter(
  database,
  sessions as any,
  users,
);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
    };
  },
});

export const validateRequest = async (
  sessionId: string | undefined,
): Promise<
  { user: User; session: Session } | { user: null; session: null }
> => {
  if (!sessionId) {
    return {
      user: null,
      session: null,
    };
  }

  const result = await lucia.validateSession(sessionId);
  return result;
};

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: CustomUserId;
    };
    UserId: CustomUserId;
  }
}

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
);

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`,
);
