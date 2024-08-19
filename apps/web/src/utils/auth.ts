import { trpc } from "../router";

export const useUser = () => {
  const { data: session } = trpc.auth.getSession.useQuery();
  return session?.userId ?? null;
};
