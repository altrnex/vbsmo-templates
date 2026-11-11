# Vibeissimo application templates

The builder copies these standalone projects into customer workspaces:

- [astro-functions](astro-functions/README.md): Astro website with an optional Hono API.
- [nextjs-static](nextjs-static/README.md): Next.js static website.
- [astro-single-vm](astro-single-vm/README.md): Astro server with embedded Hono and PostgreSQL.
- [nextjs-single-vm](nextjs-single-vm/README.md): Next.js server with embedded Hono and PostgreSQL.

[Playbooks](playbooks/) describe optional integrations that can be applied to the single-VM templates when requested.

Each project owns its dependencies, lockfile, and check commands. Deployment infrastructure belongs
to the provider packages in the Vibeissimo application repository.

The builder also uses the `*-bootstrap` directories and `astro-toolchain` to prepare new workspaces.
The Vibeissimo application pins this repository as a Git submodule, so releases use an exact commit.

The canonical repository is `git.seyka.ru/vibeissimo/vbsmo-templates`. GitHub hosts the public
checkout used by the application and CI; dev Forgejo has the same commits. Push a template change
to all three before updating the application's submodule commit.
