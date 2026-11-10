# Astro single-VM application

This Bun workspace runs one Astro server. The API is a Hono router mounted at `/api` by the Astro endpoint. Keep application routes and server-only runtime logic in `apps/web`; keep the database schema and migrations in `packages/db`. Chain Hono methods and compose routers with `.route()`.

The SQLite database belongs at `DATABASE_PATH`. Run `bun run db:migrate` before starting a new installation or a changed schema. Never seed or replace an existing database on restart. Keep uploads alongside the database on the persistent data mount. Do not import `bun:sqlite` or server-only code into browser scripts.

Read the applicable `docs/playbooks` file when the user requests an optional integration. Astro i18n uses built-in routing. Better Auth can use the existing embedded Hono router and database; it does not require another service. Keep the root lockfile synchronized when adding dependencies. Verify with `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` after the requested feature works.
