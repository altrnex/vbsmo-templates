# Your Django application

This project runs Django and PostgreSQL. The source in `apps/web` runs locally without Vibeissimo.
Install Bun 1.4.5, Python 3.14, uv and PostgreSQL 18. Create a private local database and role with
permission to create a test database. Export `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`
and a randomly generated `DJANGO_SECRET_KEY` in your terminal. Never commit their values.

```sh
bun install --frozen-lockfile
uv venv --python 3.14 apps/web/.venv
uv pip install --python apps/web/.venv/bin/python -r apps/web/requirements.txt
cd apps/web
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
cd ../..
bun run dev
```

Visit http://localhost:4321. Use `manage.py changepassword` to recover an account. The starter does
not create public credentials or let the first visitor become an administrator.

Use ordinary Django models, migrations, views, forms, sessions and templates. Extend `base.html`
for pages with native forms: its `same-origin` referrer metadata preserves Django's normal HTTPS
CSRF checks while suppressing referrers to other origins. Run `bun run lint:fix`,
`bun run typecheck`, `bun run test` and `bun run build` before publishing. Build collects static assets;
it does not convert the application to a static website. Serve private uploads through an authorized
Django view, with attachment disposition and `nosniff`; never expose the upload directory publicly.

Vibeissimo preview uses a private PostgreSQL cluster outside tracked source. Data remains while that
workspace exists. When preview checkpoints are configured, recovery restores database records and
private uploads from a compatible checkpoint. Preview credentials, data and uploads never enter
source downloads or production bundles.

On a VM, write the application's environment values to `.env.production` beside `compose.yaml`, one
`NAME='value'` line each (a value cannot contain `'`); the build and the app read them from that
file. Export `VBSMO_HOSTNAME`, an absolute `VBSMO_DATA_DIR` on the mounted data disk, and
`VBSMO_DB_PASSWORD` (a random hexadecimal password, for example `openssl rand -hex 32`) in the shell
that runs `docker compose`, not in `.env.production`. `docker compose up -d --build` builds the app
from `Dockerfile` and starts it with PostgreSQL 18 and Caddy, which obtains the certificate for the
hostname. The app keeps its media and generated secret key in `app/`. Keep `app/`, `postgres/` and
`caddy/` under `VBSMO_DATA_DIR` across releases. Cloud operations and routine backups remain in your
cloud console. Restoring source does not undo database changes.
