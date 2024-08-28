import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { env } from "./src/env/server";
import path from "node:path";

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/trpc": {
        target: env.BACKEND_URL,
        changeOrigin: true,
      },
    },
  },
});
