import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { z } from "zod";

const greeting = z.object({ name: z.string().trim().min(1).max(80) });

export const app = new Hono({ strict: false })
  .basePath("/v1")
  .use(bodyLimit({ maxSize: 4096, onError: (c) => c.json({ error: "Request too large." }, 413) }))
  .get("/health", (c) => c.json({ status: "ok" }))
  .get("/hello", (c) => c.json({ message: "Hello!" }))
  .post(
    "/hello",
    zValidator("json", greeting, (result, c) => {
      if (!result.success)
        return c.json({ error: "Enter a name between 1 and 80 characters." }, 400);
    }),
    (c) => c.json({ message: `Hello, ${c.req.valid("json").name}!` }),
  )
  .notFound((c) => c.json({ error: "Not found." }, 404));
