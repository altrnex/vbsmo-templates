import { readFileSync } from "node:fs";
import * as schema from "@vbsmo/db/schema";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// The dev server re-evaluates this module on reloads; reuse its pool rather than leaking one each time.
const shared = globalThis as { vbsmoSql?: ReturnType<typeof createClient> };

export function getDb() {
  shared.vbsmoSql ??= createClient();
  return drizzle({ client: shared.vbsmoSql, schema });
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
    return postgres({
      host: config.socket,
      user: config.user,
      password: config.password,
      database: config.database,
      max: 5,
    });
  }
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  return postgres(url, { max: 5 });
}

export async function closeDb() {
  await shared.vbsmoSql?.end();
  shared.vbsmoSql = undefined;
}
