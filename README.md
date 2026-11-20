# Vibeissimo application templates

The builder copies these standalone projects into customer workspaces:

- [astro-static](astro-static/README.md): Astro static website (the per-type template for Astro Static applications).
- [nextjs-static](nextjs-static/README.md): Next.js static website.
- [nextjs-single-vm](nextjs-single-vm/README.md): Next.js server with embedded Hono, PostgreSQL, Tailwind 4 and a preinstalled shadcn/ui kit.
- [tanstack-start-single-vm](tanstack-start-single-vm/README.md): TanStack Start (Vite, Nitro on Bun) with embedded Hono, PostgreSQL, Tailwind 4 and the same shadcn/ui kit.

[Playbooks](playbooks/) describe optional integrations that can be applied to the single-VM templates when requested.

Each project owns its dependencies, lockfile, and check commands. Deployment infrastructure belongs
to the provider packages in the Vibeissimo application repository.

The builder also uses the `*-bootstrap` directories and `astro-toolchain` to prepare new workspaces.
The Vibeissimo application pins this repository as a Git submodule, so releases use an exact commit.

GitHub (`altrnex/vbsmo-templates`) is the only source. The deployed application publishes the
pinned templates to the per-type Forgejo repositories automatically.
