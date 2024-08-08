import { useQuery } from "@tanstack/react-query";
import { client } from "./hono";

export const useAuth = () => {
  const query = useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await client.api.auth.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch auth data");
      }
      const { user, session } = await response.json();
      return { user, session };
    },
  });

  return query;
};
