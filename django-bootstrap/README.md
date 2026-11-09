# Your Django website

This is a static Django website in `apps/web`, with a FastAPI application in `functions/api` when
functions are enabled. Local development needs no Studio, Docker, cloud account or secrets.

## Install and run

Install Bun **1.4.4**, Python **3.14** and uv. From the repository root:

```sh
bun install --frozen-lockfile
uv venv --python 3.14 apps/web/.venv
uv pip install --python apps/web/.venv/bin/python -r apps/web/requirements.txt
```

If the project has `functions/api`, install its separate environment too:

```sh
uv venv --python 3.14 functions/api/.venv
uv pip install --python functions/api/.venv/bin/python --require-hashes -r functions/api/requirements.txt
uv pip install --python functions/api/.venv/bin/python -r functions/api/requirements-dev.txt
```

Then run `bun run dev` and open <http://localhost:4321>. Ctrl+C stops both servers. The website and
API listen on loopback ports 4321 and 3001. No database or background container is created.

## Change and check

Edit `apps/web/templates/index.html` to change the page. Styles live in
`apps/web/assets/styles/site.css`; run `bun run css:build` after changing styles or class names.
For projects with functions, `functions/api/index.py` contains the greeting API. Change `Hello,`
to `Welcome,`, submit the form again, then update `test_api.py`. The starter does not save data.

```sh
bun run lint
bun run typecheck
bun run test
bun run build
bun run package:api      # Functions only; also requires zip and tar
```

`lint:fix` formats Python, templates and browser code. The web checks use Django's system checker;
the API syntax check and unit tests exercise its maintained Python code. Build exports a static
website to `apps/web/dist`. Packaging copies readable Python source and hash-locked Linux/x86_64
wheels into `.build/function.zip`. Build outputs and virtual environments are ignored by Git.
There is no bundled build program. Run builds without cloud credentials.

## How the form works

`static/js/greeting.js` calls the API using `static/js/api.js`. Locally, `siteapp/api_proxy.py`
forwards `/v1/*` to FastAPI. The proxy is unavailable during static export. Published pages use
the deployed API URL instead; Django itself is not deployed as a server.

`.vbsmo.json` declares public method/path pairs and environment names; route paths include
the `/v1` prefix. Keep `GET /v1/health/`, which returns `{ "status": "ok" }` and is linked in Studio.
Add the declaration when you add a route. `functions/api/cloud.py` denies
undeclared routes and loads secret bindings before importing the same API. For local variables,
use your shell environment. Never commit values or put them in browser code.

CAPTCHA is excluded: required-CAPTCHA routes remain denied in the cloud. The starter has validation
but no authentication, database, email delivery or persistent storage.

## Deploy

Read [infra/tofu/README.md](infra/tofu/README.md) for your selected provider's prerequisites,
public inputs, secret setup and publish/inspect/destroy commands. Studio fills public connection
inputs when you link the project. A downloaded checkout uses those same files and ordinary CLIs.
Remote OpenTofu state is the only source of deployment IDs and URLs; there is no second descriptor.
