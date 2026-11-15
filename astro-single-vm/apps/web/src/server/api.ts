import { zValidator } from "@hono/zod-validator";
import { notes } from "@vbsmo/db/schema";
import { Hono } from "hono";
import { z } from "zod";
import { getDb } from "./db.ts";

const newNote = z.object({ body: z.string().trim().min(1).max(500) });

export const api = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }, 200))
  .get("/notes", async (c) => c.json(await getDb().select().from(notes), 200))
  .post(
    "/notes",
    zValidator("json", newNote, (result, c) => {
      if (!result.success) return c.json({ error: "Enter a note of 1–500 characters." }, 400);
    }),
    async (c) => {
      const [note] = await getDb().insert(notes).values(c.req.valid("json")).returning();
      return c.json(note, 201);
    },
  );

export type ApiType = typeof api;
