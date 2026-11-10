import { Database } from "bun:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import * as schema from "@vbsmo/db/schema";
import { drizzle } from "drizzle-orm/bun-sqlite";

let connection: ReturnType<typeof drizzle<typeof schema>> | undefined;
export function getDb() {
  if (connection) return connection;
  if (process.env.NODE_ENV === "production" && !process.env.DATABASE_PATH) {
    throw new Error("DATABASE_PATH is required in production");
  }
  const cwd = process.cwd();
  const workspace =
    basename(cwd) === "web" && basename(dirname(cwd)) === "apps" ? resolve(cwd, "../..") : cwd;
  const filename = resolve(
    /* turbopackIgnore: true */ process.env.DATABASE_PATH ??
      resolve(workspace, ".vbsmo-runtime/data/app.sqlite"),
  );
  if (
    process.env.NODE_ENV === "production" &&
    !existsSync(resolve(dirname(filename), ".vbsmo-data"))
  ) {
    throw new Error("The provisioned data mount is missing");
  }
  mkdirSync(dirname(filename), { recursive: true });
  const sqlite = new Database(filename, { create: true });
  for (const pragma of [
    "journal_mode = WAL",
    "foreign_keys = ON",
    "busy_timeout = 5000",
    "synchronous = FULL",
  ]) {
    sqlite.query(`PRAGMA ${pragma}`).run();
  }
  connection = drizzle({ client: sqlite, schema });
  return connection;
}
