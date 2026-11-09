# Vibeissimo application templates

The builder copies these standalone projects into customer workspaces:

- [astro-functions](astro-functions/README.md): Astro website with an optional Hono API.
- [nextjs-static](nextjs-static/README.md): Next.js static website.

Each project owns its dependencies, lockfile, and check commands. Deployment infrastructure belongs
to the provider packages in the Vibeissimo application repository.

The builder also uses the `*-bootstrap` directories and `astro-toolchain` to prepare new workspaces.
The Vibeissimo application pins this repository as a Git submodule, so releases use an exact commit.
