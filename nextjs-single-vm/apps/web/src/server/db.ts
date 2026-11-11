import { readFileSync } from "node:fs";
import * as schema from "@vbsmo/db/schema";

let client: import("bun").SQL | undefined;
let connection: Promise<Awaited<ReturnType<typeof createDb>>> | undefined;

export function getDb() {
  if (!connection) connection = createDb();
  return connection;
}

async function createDb() {
  const { SQL } = await import("bun");
  const { drizzle } = await import("drizzle-orm/bun-sql");
  const previewFile = process.env.VBSMO_PREVIEW_DATABASE_FILE;
  if (previewFile) {
    const config = JSON.parse(readFileSync(previewFile, "utf8")) as {
      socket: string;
      user: string;
      password: string;
      database: string;
    };
    client = new SQL({
      adapter: "postgres",
      path: config.socket,
      username: config.user,
      password: config.password,
      database: config.database,
      max: 5,
    });
  } else {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is required");
    client = new SQL({ url, max: 5 });
  }
  return drizzle({ client, schema });
}

export async function closeDb() {
  await client?.close();
  client = undefined;
  connection = undefined;
}
