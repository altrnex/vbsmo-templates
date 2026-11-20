import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

export default defineConfig({
  // The preview gateway serves the dev server under its own host name.
  server: { allowedHosts: true },
  // Bun supplies its own module at runtime.
  build: { rolldownOptions: { external: ["bun"] } },
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), nitro(), react(), tailwindcss()],
});
