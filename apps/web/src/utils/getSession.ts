import { useQuery } from "@tanstack/react-query";

import type { AppType } from "@acme/rpc";
import { hc } from "hono/client";

const client = hc<AppType>("http://localhost:3000");

export function getCurrentUser() {
  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const response = await client.getSession.$get();
      if (!response.ok) {
        throw new Error("Failed to get session");
      } else {
        const data = await response.json();
        return data;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function getHello() {
  return useQuery({
    queryKey: ["hello"],
    queryFn: async () => {
      const response = await client.posts.hello.$get();
      if (!response.ok) {
        throw new Error("Failed to get hello");
      } else {
        const data = response.json();
        return data;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
