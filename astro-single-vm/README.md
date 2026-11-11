# Astro single-VM starter

Install Bun 1.4.4 and PostgreSQL 17. Set `DATABASE_URL` for your local database, then run `bun install --frozen-lockfile`, `bun run db:migrate`, and `bun run dev`. Open http://127.0.0.1:4321. The notes API persists data in PostgreSQL.

Run `bun run build` for the server build. Production needs `DATABASE_URL` and the committed migrations; the image runs those migrations before starting. Database data belongs on a persistent disk outside the image. Run `bun run db:generate` after changing `packages/db/schema.ts` and commit the generated migration.

For a VM, build an immutable image and set `VBSMO_IMAGE`, `VBSMO_HOSTNAME`, an absolute `VBSMO_DATA_DIR` on the mounted data disk, and `VBSMO_DB_PASSWORD` to a random hexadecimal password (for example, `openssl rand -hex 32`). `docker compose up -d` starts the app, PostgreSQL 17, and Caddy. Keep both `app/` and `postgres/` under `VBSMO_DATA_DIR` across releases. Read `docs/playbooks` when adding optional integrations.
