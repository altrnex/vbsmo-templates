# Next.js single-VM application

This Bun workspace runs one Next.js server. The API is a Hono router mounted at `/api` by the App Router handler. Keep application routes and server-only runtime logic in `apps/web`; keep the database schema and migrations in `packages/db`. Chain Hono methods and compose routers with `.route()`.

The SQLite database belongs at `DATABASE_PATH`. Run `bun run db:migrate` before starting a new installation or a changed schema. Never seed or replace an existing database on restart. Keep uploads alongside the database on the persistent data mount. Keep `bun:sqlite` and database code out of Client Components and Edge routes. Check that production builds preserve Bun runtime imports.

Read the applicable `docs/playbooks` file when the user requests an optional integration. Better Auth can use the existing embedded Hono router and database; it does not require another service. Keep the root lockfile synchronized when adding dependencies. Verify with `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` after the requested feature works.
