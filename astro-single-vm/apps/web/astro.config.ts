import node from "@astrojs/node";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

export default defineConfig({
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["react", "react-dom/client", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
    build: { rolldownOptions: { external: ["bun"] } },
  },
  server: { port: 4321 },
});
