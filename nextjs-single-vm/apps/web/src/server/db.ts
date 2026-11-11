import { readFileSync } from "node:fs";
import { SQL } from "bun";
import * as schema from "@vbsmo/db/schema";
import { drizzle } from "drizzle-orm/bun-sql";

let client: SQL | undefined;
let connection: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (connection) return connection;
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
  connection = drizzle({ client, schema });
  return connection;
}

export async function closeDb() {
  await client?.close();
  client = undefined;
  connection = undefined;
}
