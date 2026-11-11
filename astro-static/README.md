# Your Astro website

This is an ordinary Bun workspace: website source in `apps/web`, with a Hono API in `functions/api`
when functions are enabled. Local development needs no Studio, Docker, cloud account or credentials.

## Start and change it

Install Bun **1.4.4** and Node.js **24.20.0**, then run from the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:4321>. Ctrl+C stops the website and API together. Both listen on loopback;
the API uses port 3001. Do not run a second copy on those same ports.

Edit `apps/web/src/pages/index.astro` to change the page. If this project includes functions, the
starter's form sends your name to `functions/api/index.ts`. Change `Hello,` to `Welcome,`, submit
again and update the matching API test. Nothing is saved or sent to another service by the starter.

Astro's config proxies `/v1/*` to the local API. `functions/api/dev.ts` starts Hono; `index.ts`
contains the actual application. The browser helper `apps/web/src/api.ts` uses the local proxy,
Studio's preview address or the published API URL. No application code needs a Studio dependency.

## Check and build

```sh
bun run lint
bun run typecheck
bun run test
bun run build
bun run package:api    # Only when functions/api exists; requires zip
```

Use `bun run lint:fix` to format source. The website uses TypeScript **6.0.3** for Astro's checker;
the API uses `bun check` for typechecking and TypeScript **7.0.2** for compilation.
`apps/web/dist` contains the static website. `functions/api/dist` contains normal readable
JavaScript emitted by `tsc`, one file per source file. `.build/function.zip` contains that code and
normal production dependencies, not a bundled build program. These outputs are ignored by Git.

The short packaging script is `infra/vbsmo/package.sh`. It uses a temporary directory and removes it
on exit. Build without cloud credentials. Building does not publish or change infrastructure.
Serving the static output alone does not start the API; use `bun run dev` for local form testing.

## API routes and environment

`.vbsmo.json` declares the runtime, public route method/path pairs and environment **names**.
Paths there are full public paths, such as `/v1/hello` and `/v1/health/`.

`GET /v1/health/` returns `{ "status": "ok" }`. Studio lists this endpoint beside the website URL.
Add a matching declaration when you add a public route. Cloud adapters deny undeclared routes.
Do not put secret values in this file, browser code, tests or Git.

The cloud entrypoint uses `cloud.ts` to check declared routes and load secret
bindings before importing the same API. They contain no provisioning or release-management code.
For local development, pass API variables in your shell; never use a frontend-public env prefix
for a secret. Read declared variables and secrets with `process.env.NAME` in the API; Hono `c.env`
does not contain them. Test with a non-empty synthetic value and restore the previous process
environment afterward. The starter needs none.

CAPTCHA is not implemented. Cloud routes marked `required` are denied, regardless of `NODE_ENV`.
The starter has validation, but no database, authentication, email delivery or persistent storage.

## Deploy

When cloud hosting is configured, read [infra/tofu/README.md](infra/tofu/README.md). It lists provider
prerequisites, public configuration, secret setup and the publish/inspect/destroy commands. Studio
fills the public inputs when you link the project; a downloaded Git checkout uses the same files
and ordinary CLIs. Remote OpenTofu state owns deployment IDs and URLs, with no second descriptor.

The maintained reference template may be used locally without a cloud configuration. Deployment
requires the selected provider's `infra/tofu` files and public connection inputs first.
