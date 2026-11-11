import { fileURLToPath } from "node:url";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { closeDb, getDb } from "./db.ts";

try {
  await migrate(getDb(), {
    migrationsFolder: fileURLToPath(new URL("../../../../packages/db/drizzle", import.meta.url)),
  });
} finally {
  await closeDb();
}
