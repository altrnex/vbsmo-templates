# Next.js i18n

Use when a Next.js application needs more than one language. Applies to `nextjs-single-vm`. This recipe describes integration work and has not yet been validated against a completed multilingual feature.

1. Inspect the existing App Router pages, layout, metadata, and any language routing. Use exactly the requested locales and one explicit default. Choose the URL policy before editing routes.
2. Implement locale-aware routes and content using the pinned Next.js App Router APIs. Add a library only if the requested translation or formatting behavior needs it; pin it and keep the root lockfile synchronized. Keep Hono `/api` and `/api/auth` paths stable.
3. Preserve server rendering, cookie behavior, links and form actions when adding locale routing. Set document language, canonical and alternate-language metadata, and language navigation to equivalent pages.
4. Verify direct entry and refresh for every requested locale, unknown locales, an API write/read, and the production standalone build. Verify any auth callback path after auth is added.

Reference: [Next.js internationalization](https://nextjs.org/docs/app/guides/internationalization).
