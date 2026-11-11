import { notes } from "@vbsmo/db/schema";
import { Hono } from "hono";
import { validator } from "hono/validator";
import { getDb } from "./db.ts";

export const api = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .get("/notes", async (c) => c.json(await getDb().select().from(notes), 200))
  .post(
    "/notes",
    validator("json", (value, c) => {
      const body = typeof value.body === "string" ? value.body.trim() : "";
      if (!body || body.length > 500)
        return c.json({ error: "Enter a note of 1–500 characters." }, 400);
      return { body };
    }),
    async (c) => {
      const [note] = await getDb().insert(notes).values(c.req.valid("json")).returning();
      return c.json(note, 201);
    },
  );

export type ApiType = typeof api;
