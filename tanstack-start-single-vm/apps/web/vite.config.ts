import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

// Bun supplies its own module at runtime, in the build and in the dev dependency scan.
const external = ["bun"];

export default defineConfig({
  // The preview gateway serves the dev server under its own host name.
  server: { allowedHosts: true },
  build: { rolldownOptions: { external } },
  optimizeDeps: { rolldownOptions: { external } },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro(), react(), tailwindcss()],
});
