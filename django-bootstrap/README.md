# Your Django website

This is a static Django website in `apps/web`. Local development needs no Studio, Docker, cloud account or secrets.

## Install and run

Install Bun **1.4.5**, Python **3.14** and uv. From the repository root:

```sh
bun install --frozen-lockfile
uv venv --python 3.14 apps/web/.venv
uv pip install --python apps/web/.venv/bin/python -r apps/web/requirements.txt
```

Then run `bun run dev` and open <http://localhost:4321>. Ctrl+C stops the website,
which listens on loopback. No database or background container is created.

## Change and check

Edit `apps/web/templates/index.html` to change the page. Styles live in
`apps/web/assets/styles/site.css`; run `bun run css:build` after changing styles or class names.
```sh
bun run lint
bun run typecheck
bun run test
bun run build
```

`lint:fix` formats Python, templates and browser code. The web checks use Django's system checker.
Build exports a static website to `apps/web/dist`. Build outputs and virtual environments are ignored by Git.
Run builds without cloud credentials.

## Deploy

`infra/` belongs to the platform: it writes the deployment files there when the application is
linked. Leave it unchanged.
