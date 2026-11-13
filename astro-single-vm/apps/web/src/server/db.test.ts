import { expect, test } from "bun:test";

// A distinct specifier re-evaluates the module, as a dev-server reload does.
const load = (reload: string) => import(`./db.ts?${reload}`) as Promise<typeof import("./db.ts")>;

test("a reloaded database module reuses the open connection pool", async () => {
  const url = process.env.DATABASE_URL;
  process.env.DATABASE_URL = "postgres://user@127.0.0.1:1/app";
  try {
    const first = await load("first");
    const second = await load("second");
    expect(second.getDb().$client).toBe(first.getDb().$client);
    await first.closeDb();
  } finally {
    if (url === undefined) delete process.env.DATABASE_URL;
    else process.env.DATABASE_URL = url;
  }
});
