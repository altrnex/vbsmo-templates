# Astro single-VM application

This Bun workspace runs one Astro server. The API is a Hono router mounted at `/api` by the Astro endpoint. Export its inferred `ApiType` and use the typed `hc` client for browser API calls. Keep application routes and server-only runtime logic in `apps/web`; keep the database schema and migrations in `packages/db`. Chain Hono methods and compose routers with `.route()`.

PostgreSQL 18 is the only database. Set `DATABASE_URL` locally and in production; the platform supplies its private PostgreSQL settings for preview. Run `bun run db:migrate` before starting a new installation or a changed schema; `bun run db:check` checks that the database migration history matches the source without changing data. Never seed or replace an existing database on restart. Write uploads to `UPLOADS_DIR` on the persistent data mount; preview checkpoints include that directory. Keep database code out of browser scripts.

Read the applicable `docs/playbooks` file when the user requests an optional integration. Astro i18n uses built-in routing. Better Auth can use the existing embedded Hono router and database; it does not require another service. Keep the root lockfile synchronized when adding dependencies. Verify with `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` after the requested feature works.
