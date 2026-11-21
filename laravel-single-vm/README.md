# Laravel single-VM starter

Laravel 13 (PHP 8.5) with Inertia 3, React 19, TypeScript, Tailwind 4 and shadcn/ui, built with plain Vite; PostgreSQL 18 is the database and Fortify provides registration and login. The application is in `apps/web`.

Install PHP 8.5 (with `pdo_pgsql`, `intl`, `bcmath`, `zip`), Composer 2.11, Bun 1.4.5 and PostgreSQL 18. In `apps/web`, copy `.env.example` to `.env`, set `DB_URL`, then run `composer install`, `php artisan key:generate`, `php artisan migrate`, `bun install --frozen-lockfile` (from the repository root) and `bun ./node_modules/vite/bin/vite.js build --watch`, and serve it with `php artisan serve`. Open http://127.0.0.1:8000.

`bun run lint`, `bun run typecheck`, `bun run test` and `bun run build` run Pint, Biome, TypeScript, Larastan (level 5), PHPUnit and the production Vite build. The tests need PHP's `pdo_sqlite`.

On a VM, write the application's environment values to `.env.production` beside `compose.yaml`, one `NAME='value'` line each (a value cannot contain `'`). Export `VBSMO_HOSTNAME`, an absolute `VBSMO_DATA_DIR` on the mounted data disk, and `VBSMO_DB_PASSWORD` (a random hexadecimal password, for example `openssl rand -hex 32`) in the shell that runs `docker compose`, not in `.env.production`. `docker compose up -d --build` builds the app from `Dockerfile` (FrankenPHP in classic mode behind Caddy) and starts it with PostgreSQL 18 and Caddy, which obtains the certificate for the hostname. The container runs the migrations and `php artisan optimize` at start and creates `APP_KEY` once in `app/app-key` on the data disk. Keep `app/`, `postgres/` and `caddy/` under `VBSMO_DATA_DIR` across releases: `storage/` lives in `app/storage` and uploads in `app/uploads`.
