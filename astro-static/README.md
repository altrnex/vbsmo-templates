# Your Astro website

This is an ordinary Bun workspace with static website source in `apps/web`. Local development needs no Studio, Docker, cloud account or credentials.

## Start and change it

Install Bun **1.4.5** and Node.js **24.20.0**, then run from the repository root:

```sh
bun install --frozen-lockfile
bun run dev
```

Open <http://localhost:4321>. Ctrl+C stops the website, which listens on loopback.
Do not run a second copy on the same port.

Edit `apps/web/src/pages/index.astro` to change the page.

## Check and build

```sh
bun run lint
bun run typecheck
bun run test
bun run build
```

Use `bun run lint:fix` to format source. The website uses TypeScript **6.0.3** for Astro's checker.
`apps/web/dist` contains the static website. Build outputs are ignored by Git.

Build without cloud credentials. Building does not publish or change infrastructure.

## Deploy

`infra/` belongs to the platform: it writes the deployment files there when the application is
linked. Leave it unchanged.
