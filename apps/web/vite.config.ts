import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
// import { fileURLToPath } from "node:url";
import path from "node:path";
// import createJiti from "jiti";

// const jiti = createJiti(fileURLToPath(import.meta.url));
// jiti("./src/env");
// createJiti(fileURLToPath(import.meta.url))("./src/env");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@acme/api": path.resolve(__dirname, "../packages/api"),
      "@acme/auth": path.resolve(__dirname, "../packages/auth"),
      "@acme/db": path.resolve(__dirname, "../packages/db"),
      "@acme/ui": path.resolve(__dirname, "../packages/ui"),
      "@acme/validators": path.resolve(__dirname, "../packages/validators"),
    },
  },
  build: {
    // Equivalent to Next.js transpilePackages
    commonjsOptions: {
      include: [/node_modules/, /packages\/(api|auth|db|ui|validators)/],
    },
  },
  esbuild: {
    // Similar to Next.js' ignoreBuildErrors for TypeScript
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
});
