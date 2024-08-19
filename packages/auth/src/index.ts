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

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: {
      id: CustomUserId;
    };
    UserId: CustomUserId;
  }
}

export const validateRequest = async (
  sessionId: string | null,
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

export const invalidateSessionToken = async (sessionId: string) => {
  await lucia.invalidateSession(sessionId);
};

export const github = new GitHub(
  env.GITHUB_CLIENT_ID,
  env.GITHUB_CLIENT_SECRET,
);

export const google = new Google(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  `${env.HOST_NAME}/api/login/google/callback`,
);

export type { Session, User };
