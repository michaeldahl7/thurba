import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
// import { env } from "./src/env/server";
import path from "node:path";
// import { fileURLToPath } from "node:url";
// import path from "node:path";
// import createJiti from "jiti";

// const jiti = createJiti(fileURLToPath(import.meta.url));
// jiti("./src/env");
// createJiti(fileURLToPath(import.meta.url))("./src/env");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
