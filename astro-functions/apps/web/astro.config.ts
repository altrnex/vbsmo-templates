import { defineConfig } from "astro/config";

export default defineConfig({
  output: "static",
  server: { port: 4321 },
  vite: {
    server: {
      strictPort: true,
      proxy: {
        "/api": {
          rewrite: (pathname) => pathname.slice(4) || "/",
          target: `http://127.0.0.1:${process.env.API_PORT ?? 3001}`,
        },
      },
    },
  },
});
