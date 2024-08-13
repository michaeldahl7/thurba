import type { UserId } from "lucia";
import { lucia, validateRequest } from "./index";
import { AuthenticationError } from "./util";

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
