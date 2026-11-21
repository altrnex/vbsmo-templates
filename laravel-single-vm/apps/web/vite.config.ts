import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import laravel from "laravel-vite-plugin";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    laravel({ input: ["resources/css/app.css", "resources/js/app.tsx"] }),
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { "@": new URL("./resources/js", import.meta.url).pathname } },
});
