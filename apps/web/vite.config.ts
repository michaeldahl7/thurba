// import path from "node:path";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { env } from "./env/server";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],

  resolve: {
    alias: { "@ui": path.resolve(__dirname, "../../packages/ui/src") },
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
