import { client } from "./hono";
import type { User, Session } from "lucia";

interface ApiSession {
  id: string;
  expiresAt: string;
  fresh: boolean;
  userId: string;
}

export const auth: Auth = {
  user: null,
  session: null,
  getUser: async () => {
    const res = await client.api.auth.$get();
    if (res.ok) {
      const data = await res.json();
      console.log(data.user, data.session);
      auth.user = data.user;
    }
  },
  getSession: async () => {
    const res = await client.api.auth.$get();
    if (res.ok) {
      const data = await res.json();
      console.log(data.user, data.session);
      const session = convertSession(data.session);
      auth.session = session;
    }
  },
};

export type Auth = {
  user: User | null;
  session: Session | null;
  getUser: () => Promise<void>;
  getSession: () => Promise<void>;
};

function convertSession(apiSession: ApiSession | null): Session | null {
  if (!apiSession) return null;
  return {
    ...apiSession,
    expiresAt: new Date(apiSession.expiresAt),
  };
}
