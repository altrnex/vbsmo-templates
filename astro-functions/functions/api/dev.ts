import { app } from "./index.ts";

const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.API_PORT ?? 3001),
  fetch: app.fetch,
});

console.log(`API listening at ${server.url}`);
