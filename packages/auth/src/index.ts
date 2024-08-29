import { database } from "@acme/db/client";
// import { AuthenticationError } from "./util";
import { sessions, users } from "@acme/db/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub, Google } from "arctic";
import { Lucia } from "lucia";
import type { Session, User } from "lucia";
import { env } from "../env";
import type { UserId as CustomUserId } from "./types";

export const adapter = new DrizzlePostgreSQLAdapter(
  database,
  sessions as any,
  users as any,
);

export type AuthContext =
  | { user: User; session: Session }
  | { user: null; session: null };

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
  `${env.BACKEND_URL}/api/login/google/callback`,
);

export type { Session, User };
