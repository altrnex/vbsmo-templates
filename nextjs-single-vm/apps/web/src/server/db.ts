import { readFileSync } from "node:fs";
import * as schema from "@vbsmo/db/schema";

// The dev server re-evaluates this module on reloads; reuse its pool rather than leaking one each time.
const shared = globalThis as { vbsmoSql?: import("bun").SQL };
let connection: Promise<Awaited<ReturnType<typeof createDb>>> | undefined;

export function getDb() {
  if (!connection) connection = createDb();
  return connection;
}

async function createDb() {
  const { SQL } = await import("bun");
  const { drizzle } = await import("drizzle-orm/bun-sql");
  shared.vbsmoSql ??= createClient(SQL);
  return drizzle({ client: shared.vbsmoSql, schema });
}

function createClient(SQL: typeof import("bun").SQL) {
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
