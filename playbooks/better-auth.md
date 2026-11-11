# Better Auth in a single-VM application

Use when the application needs sign-in, sessions, or protected routes. Applies to `astro-single-vm` and `nextjs-single-vm`; the Hono router and Drizzle PostgreSQL database are already present. This recipe describes integration work and has not yet been validated against a completed auth feature.

1. Inspect `apps/web/src/server/api.ts`, `db.ts`, `schema.ts`, the framework's `/api` adapter, and existing auth code. Preserve a working auth installation if one exists. Decide sign-in methods, registration policy, public origin, and any email delivery with the user where the product request does not establish them.
2. Add compatible pinned `better-auth` and `@better-auth/drizzle-adapter` dependencies to `apps/web` with Bun. Configure one Better Auth instance using the existing Drizzle database and PostgreSQL adapter. Generate the required auth schema, add it to the canonical Drizzle schema, generate and inspect a checked-in migration, then run the migration explicitly.
3. Mount the auth handler at `/api/auth/*` in the existing Hono router, before catch-all routes. Keep one route owner. Configure a stable `BETTER_AUTH_SECRET`, public URL, trusted origins, secure host-scoped cookies, and an explicit development URL. Keep secrets out of Git, client bundles, and image layers.
4. Protect Hono actions and server-rendered pages using the request's session. Pass the current request headers; preserve `Set-Cookie` when a server response changes sessions. Include CSRF and authorization checks for state-changing application actions.
5. Verify sign-up/sign-in as requested, protected access, sign-out, invalid-session behavior, and session continuity after app restart and code redeploy. Verify a fresh installation and a database that already contains notes. Do not overwrite either database.

Primary references: [Better Auth Hono](https://better-auth.com/docs/integrations/hono), [Drizzle adapter](https://better-auth.com/docs/adapters/drizzle), [Astro](https://better-auth.com/docs/integrations/astro), [Next.js](https://better-auth.com/docs/integrations/next).
