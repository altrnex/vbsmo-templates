import { integer, pgTable, text } from "drizzle-orm/pg-core";

export const notes = pgTable("notes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  body: text("body").notNull(),
});
