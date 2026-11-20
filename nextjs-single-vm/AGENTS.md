# Next.js single-VM application

This Bun workspace runs one Next.js server. The API is a Hono router mounted at `/api` by the App Router handler. Validate request input with Zod schemas through `zValidator` from `@hono/zod-validator`. Export its inferred `ApiType` and use the typed `hc` client for browser API calls. Keep application routes and server-only runtime logic in `apps/web`; keep the database schema and migrations in `packages/db`. Chain Hono methods and compose routers with `.route()`.

PostgreSQL 18 is the only database. Set `DATABASE_URL` locally and in production; the platform supplies its private PostgreSQL settings for preview. Run `bun run db:migrate` before starting a new installation or a changed schema; `bun run db:check` checks that the database migration history matches the source without changing data. Never seed or replace an existing database on restart. Write uploads to `UPLOADS_DIR` on the persistent data mount; preview checkpoints include that directory. Keep database code out of browser components and Edge routes.

Read the applicable `docs/playbooks` file when the user requests an optional integration. Better Auth can use the existing embedded Hono router and database; it does not require another service. Keep the root lockfile synchronized when adding dependencies. sharp is preinstalled in the sandbox: import it in scripts, never install it. Verify with `bun run lint`, `bun run typecheck`, `bun run test`, and `bun run build` after the requested feature works.

Build a multi-page site, not a single scrolling landing page. Unless the request asks for one page, give the home page and each main section (for example about, services or menu, prices, contacts) its own App Router route under `apps/web/src/app`, linked from a shared header navigation and footer in the root layout, plus a working `not-found` page. Keep the home page a concise overview that links to those pages. A single-page request stays one page.

UI uses the preinstalled shadcn/ui components; read `docs/playbooks/shadcn-ui.md` before adding UI components. The colour values in `apps/web/src/app/globals.css` are neutral placeholders; replace them with the site's chosen palette and set its fonts there.

When the owner wants to edit content themselves, read `docs/playbooks/admin-content.md` for the small owner-only admin recipe.
