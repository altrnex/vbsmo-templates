import { fileURLToPath } from "node:url";
import { sql } from "drizzle-orm";
import { migrate } from "drizzle-orm/bun-sql/migrator";
import { readMigrationFiles } from "drizzle-orm/migrator";
import { closeDb, getDb } from "./db.ts";

const migrationsFolder = fileURLToPath(new URL("../../../../packages/db/drizzle", import.meta.url));
try {
  if (process.argv.includes("--check")) {
    const expected = readMigrationFiles({ migrationsFolder });
    const actual = await (await getDb()).execute(sql`select hash, created_at from drizzle.__drizzle_migrations order by created_at`);
    if (
      actual.length !== expected.length ||
      expected.some((migration, index) =>
        actual[index]?.hash !== migration.hash ||
        Number(actual[index]?.created_at) !== migration.folderMillis,
      )
    ) throw new Error("Preview database migrations do not match the source");
  } else await migrate(await getDb(), { migrationsFolder });
} finally {
  await closeDb();
}
