import { notes } from "@vbsmo/db/schema";
import { Hono } from "hono";
import { getDb } from "./db.ts";

export const api = new Hono()
  .basePath("/api")
  .get("/health", (c) => c.json({ status: "ok" }))
  .get("/notes", (c) => c.json(getDb().select().from(notes).all()))
  .post("/notes", async (c) => {
    const form = await c.req.parseBody();
    const body = typeof form.body === "string" ? form.body.trim() : "";
    if (!body || body.length > 500) return c.text("Enter a note of 1–500 characters.", 400);
    getDb().insert(notes).values({ body }).run();
    return c.redirect("/", 303);
  });
