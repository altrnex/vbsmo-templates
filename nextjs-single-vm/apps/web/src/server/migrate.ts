import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { getDb } from "./db.ts";

migrate(getDb(), {
  migrationsFolder: fileURLToPath(
    new URL("../../../../packages/db/drizzle", import.meta.url),
  ),
});
