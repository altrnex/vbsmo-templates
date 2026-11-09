import { readFileSync } from "node:fs";
import { handle } from "hono/aws-lambda";

type Route = { path: string; method: string; protection: { captcha: string } };
const manifest = JSON.parse(readFileSync(new URL("../../../.vbsmo.json", import.meta.url), "utf8"));
const routes: Route[] = manifest.capabilities.functions.routes;
const environment: string[] = manifest.capabilities.functions.environment;

// Load secrets before importing application modules that read env at startup.
let application: Promise<ReturnType<typeof handle>> | undefined;
async function initialize() {
  if (environment.length && process.env.VBSMO_SECRET_ID) {
    const { GetSecretValueCommand, SecretsManagerClient } = await import(
      "@aws-sdk/client-secrets-manager"
    );
    const client = new SecretsManagerClient({ maxAttempts: 2 });
    try {
      if (!process.env.VBSMO_SECRET_VERSION) throw new Error("Missing secret version");
      const result = await client.send(
        new GetSecretValueCommand({
          SecretId: process.env.VBSMO_SECRET_ID,
          VersionId: process.env.VBSMO_SECRET_VERSION,
        }),
        { abortSignal: AbortSignal.timeout(10_000) },
      );
      const values = JSON.parse(result.SecretString ?? "{}");
      for (const name of environment) {
        if (typeof values[name] !== "string") throw new Error("Missing secret binding");
        process.env[name] = values[name];
      }
    } finally {
      client.destroy();
    }
  }
  // Every declared binding must be available before the application starts.
  for (const name of environment) {
    if (process.env[name] === undefined) throw new Error("Missing secret binding");
  }
  const { app } = await import("./index.ts");
  return handle(app);
}

export async function handler(...args: Parameters<ReturnType<typeof handle>>) {
  const [event] = args;
  const pathname = "path" in event ? event.path : event.rawPath;
  const method =
    "httpMethod" in event
      ? event.httpMethod
      : "http" in event.requestContext
        ? event.requestContext.http.method
        : "";
  const route = routes.find(
    (route) =>
      route.path.replace(/\/$/, "") === pathname.replace(/\/$/, "") && route.method === method,
  );
  const error = (statusCode: number, message: string) => ({
    statusCode,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
    body: JSON.stringify({ error: message }),
  });
  if (!route) return error(404, "Not found");
  if (route.protection.captcha !== "none") return error(403, "Route protection is unavailable");
  try {
    application ??= initialize().catch((error) => {
      application = undefined;
      throw error;
    });
    return await (await application)(...args);
  } catch {
    return error(503, "Application API is unavailable");
  }
}
