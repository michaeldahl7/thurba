import { Lucia } from "lucia";
import type { User, Session, UserId } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { database } from "@acme/db/client";
import { GitHub, Google } from "arctic";
import { env } from "../env";
import type { UserId as CustomUserId } from "./types";
import { AuthenticationError } from "./util";
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

export const getCurrentUser = async (sessionId: string | null) => {
  const session = await validateRequest(sessionId);
  if (!session.user) {
    return null;
  }
  return session.user;
};

export const assertAuthenticated = async (sessionId: string | null) => {
  const user = await getCurrentUser(sessionId);
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function setSession(userId: UserId) {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  return sessionCookie;
}
