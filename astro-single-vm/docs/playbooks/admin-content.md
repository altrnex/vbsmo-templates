# Owner-editable content on a Single VM

Use when the owner wants to edit content themselves. Applies to `astro-single-vm` and `nextjs-single-vm`, using their PostgreSQL database, embedded Hono API and persistent `UPLOADS_DIR`. Apply this recipe to the requested site; do not install a generic CMS in the starter.

## Bound the work

Inspect existing content, authentication, schema, API and public pages first. Make only the requested texts, prices, list items and photos editable. Preserve working integrations and existing data. Do not add a page builder, media library, revision history, roles beyond owner, or content i18n unless separately requested. Use textarea or markdown for rich text; no WYSIWYG dependency.

## Owner authentication

Apply `docs/playbooks/better-auth.md` with email/password and one owner. Preserve an existing working auth installation and its users. Configure stable secrets, the actual public origin, trusted origins and secure host-only cookies. Keep secrets out of source and client bundles.

- Disable public email/password registration server-side, including direct auth API requests. A hidden sign-up button is insufficient.
- Prefer a one-off server-side owner creation command using the auth library's supported password API. Obtain credentials through private server inputs; never print passwords or put them in Git. Create the auth identity and durable owner association atomically where supported; fail closed on partial setup. Refuse creation when an owner exists, including concurrent attempts through a database uniqueness constraint. Do not grant ownership by email on every login.
- If using first-run setup instead, require a high-entropy environment secret such as `ADMIN_SETUP_TOKEN`, validate it server-side, and permanently refuse setup once the owner exists. Never expose setup without the token or re-enable it on restart.
- Put owner screens under `/admin`; leave only the login screen public. On every protected page request, check the current server session and owner identity before loading data. Redirect unauthenticated page requests to login; reject protected API requests with 401 and authenticated non-owners with 403. Check every mutation, upload and reorder independently. Do not rely on client state or a layout that can be bypassed.
- Mount auth at `/api/auth/*` once in the embedded router. Pass request headers to session checks and preserve `Set-Cookie`. Check trusted origin/CSRF on every cookie-authenticated mutation, including multipart uploads. Sign-out must invalidate access.
- Exclude `/admin` and descendants from sitemap generation and disallow them in robots.txt; add noindex on admin/login responses. These discovery controls are additional to authorization.

## Content and migrations

Keep the canonical Drizzle schema and checked-in migrations in `packages/db`; keep server runtime in `apps/web`. Model only the requested singleton text blocks and typed collections, with explicit ordering and image references. Store prices in an exact representation such as integer minor units with a currency, not floating point. Add constraints for identifiers, required fields and ordering as appropriate.

Move initial source content into the database once using an additive migration or explicitly guarded import. Preserve existing rows and edited values. Never seed over, truncate, reset or reimport content on startup. Inspect generated SQL before applying it. In the harness use `project_check` with `operation: "migrations"`; outside it run `bun run db:migrate`, then `bun run db:check` to check migration history. Do not edit an already-applied migration.

Public pages read the saved data at request time. Astro pages use `prerender = false` and the existing synchronous `getDb()`; Next pages use dynamic rendering and await `getDb()`. Avoid caching these reads in a way that hides saved changes. Keep DB modules out of browser components and Astro islands.

## API and small admin UI

Use the installed shadcn/ui kit and read `docs/playbooks/shadcn-ui.md`. Add compatible pinned auth/zod dependencies only as needed, using the documented lockfile-only dependency workflow and `project_check` dependencies in the harness. Keep the root Bun lockfile synchronized. No separate backend service is needed.

Compose admin child routers with `.route()` in `apps/web/src/server/api.ts`, chaining Hono methods and retaining the inferred `ApiType`. Use the typed `hc` browser client. Validate every body, route parameter and upload on the server with zod: trim text, bound lengths, validate IDs and prices, and reject unknown or invalid fields. Return useful validation errors without discarding the form's unsaved values.

Provide list, create, edit, delete and reorder for each requested collection, plus singleton editing. Simple move-up/move-down controls are sufficient. Reorder transactionally, rejecting missing, duplicate or foreign IDs rather than partially changing order. Confirm destructive actions and show save failures. Render plain text escaped; if markdown is requested, disallow raw HTML or sanitize rendered output.

Next interactive forms are client components calling the protected API. In Astro, keep each interactive Radix control tree inside one hydrated React island (`client:load`); import the API type only, never server implementations. Reuse existing components rather than adding another UI system.

## Photos

Write files only beneath `UPLOADS_DIR`, never the source/public directory or container's temporary filesystem. Store relative server-generated filenames and references in PostgreSQL. Serve them through an app route that resolves only valid stored filenames beneath that directory, with the verified content type and `X-Content-Type-Options: nosniff`.

- Accept only JPEG, PNG and WebP up to 5 MiB each unless the customer needs a different explicit limit. Enforce bounded reads even without Content-Length, validate declared type and actual file signature, and reject SVG, HTML, unsupported or malformed files. Never trust a client extension, filename or path.
- Generate a random filename with the verified format's extension on the server and use exclusive creation. Authorize and check origin before processing the upload. Validate file-serving paths too; do not allow traversal or arbitrary file reads.
- On replacement, write the new file first, commit its validated reference, then delete the old file only if nothing else references it. On a failed DB change, clean up the new unreferenced file. On item deletion, commit removal of the reference before deleting an unreferenced file. Keep reference checks and mutations serialized against concurrent reuse so a still-referenced photo cannot be deleted. Report cleanup failures without claiming the save failed after it committed.
- Do not build a media library. Preview checkpoints already include `UPLOADS_DIR`; preserve this persistence contract without changing the builder.

## Verification before delivery

Run the app's lint, typecheck, test and build (in the harness use `project_check` verify). Verify migrations on a fresh database and one with existing data; applying/checking again and restarting must retain prior rows and owner edits. Never reset shared data to make a check pass.

Log in as the bootstrapped owner, edit text and prices, create/edit/delete/reorder list items, and reload public pages to see the saved values without a build. Upload and replace a photo, check reference-safe cleanup, and confirm both content and photo survive preview restart. Check existing site functionality still works.

In an anonymous context, verify protected `/admin` requests redirect to login and every protected API rejects requests, including upload and reorder. Test sign-out/invalid sessions, blocked public registration, repeated setup, non-owner access where existing users exist, cross-origin mutations, invalid content/order payloads, oversized/spoofed images and traversal attempts. Check sitemap/robots/noindex and browser errors. Record observed results and any unavailable checks; never present this recipe alone as proof of a completed admin feature.
