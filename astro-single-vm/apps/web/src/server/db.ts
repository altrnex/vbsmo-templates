import { readFileSync } from "node:fs";
import * as schema from "@vbsmo/db/schema";
import { SQL } from "bun";
import { drizzle } from "drizzle-orm/bun-sql";

// The dev server re-evaluates this module on reloads; reuse its pool rather than leaking one each time.
const shared = globalThis as { vbsmoSql?: SQL };
let connection: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (connection) return connection;
  shared.vbsmoSql ??= createClient();
  connection = drizzle({ client: shared.vbsmoSql, schema });
  return connection;
}

function createClient() {
  const previewFile = process.env.VBSMO_PREVIEW_DATABASE_FILE;
  if (previewFile) {
    const config = JSON.parse(readFileSync(previewFile, "utf8")) as {
      socket: string;
      user: string;
      password: string;
      database: string;
    };
    return new SQL({
      adapter: "postgres",
      path: config.socket,
      username: config.user,
      password: config.password,
      database: config.database,
      max: 5,
    });
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  return new SQL({ url, max: 5 });
}

export async function closeDb() {
  await shared.vbsmoSql?.close();
  shared.vbsmoSql = undefined;
  connection = undefined;
}
