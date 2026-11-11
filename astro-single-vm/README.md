# Astro single-VM starter

Install Bun 1.4.4 and PostgreSQL 18. Set `DATABASE_URL` for your local database, then run `bun install --frozen-lockfile`, `bun run db:migrate`, and `bun run dev`. Open http://127.0.0.1:4321. The notes API persists data in PostgreSQL.

Run `bun run db:check` to check that the database migration history matches the source without changing data. Run `bun run build` for the server build. Production needs `DATABASE_URL` and the committed migrations; the image runs those migrations before starting. Database data belongs on a persistent disk outside the image. Run `bun run db:generate` after changing `packages/db/schema.ts` and commit the generated migration.

For a VM, build an immutable image and set `VBSMO_IMAGE`, `VBSMO_HOSTNAME`, an absolute `VBSMO_DATA_DIR` on the mounted data disk, and `VBSMO_DB_PASSWORD` to a random hexadecimal password (for example, `openssl rand -hex 32`). `docker compose up -d` starts the app, PostgreSQL 18, and Caddy. Keep both `app/` and `postgres/` under `VBSMO_DATA_DIR` across releases. `UPLOADS_DIR` points to persistent app uploads (`/data/uploads` in Compose); preview checkpoints capture its media directory alongside PostgreSQL. Read `docs/playbooks` when adding optional integrations.
