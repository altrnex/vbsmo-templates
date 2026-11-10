# Astro single-VM starter

Install Bun 1.4.4, then run `bun install --frozen-lockfile`, `bun run db:migrate`, and `bun run dev`. Open http://127.0.0.1:4321. The page saves notes through the embedded Hono route `/api/notes` into a local ignored SQLite file. Restart the server to check persistence.

Run `bun run build` for the server build. Production runs `bun apps/web/dist/server/entry.mjs` after `DATABASE_PATH` points to a durable mount and migrations have run. A release must retain that mount; the database is never part of the image. Read `docs/playbooks` when adding optional integrations.

For a container preview, create a host data directory and its `.vbsmo-data` marker on the intended persistent disk. Build with `docker build -t vbsmo-astro-single-vm:local .`, then run `docker run --rm -p 4321:4321 -v /absolute/host/data:/data vbsmo-astro-single-vm:local`. The image runs the committed migrations before starting the server. Rebuild and rerun it with the same mount to check data survival. `compose.yaml` accepts an image, absolute `VBSMO_DATA_DIR`, and `VBSMO_HOSTNAME`; Caddy keeps its certificate data in a named volume. VM provisioning must create and mount the data disk before deployment.

For container development, build `Dockerfile.dev` with `docker build -f Dockerfile.dev -t vbsmo-astro-single-vm:dev .`. Run it with the same `/data` mount and port, plus bind mounts for `apps/web/src` and `packages/db` to see source edits without rebuilding. Rebuild after dependency or config changes. Schema and generated migrations live in `packages/db`; run `bun run db:generate` after schema changes.
