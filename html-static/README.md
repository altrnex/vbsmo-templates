# HTML Static

Edit pages and assets in apps/web. There is no framework or bundler. Every page owns its header/footer; keep navigation consistent. Use relative URLs and vanilla ES modules.

Install development tools with bun install. Run bun run lint for Biome, HTML validation and local link/anchor checks; bun test tests the validation helper. Run bun run build to validate and copy the site into apps/web/dist. No typecheck is needed. The platform previews source files directly; reload after editing.

There are no includes, CSS frameworks or CDN libraries. Suggest Astro for sites beyond about five pages. Backend features such as lead capture and owner admin require Single VM.
