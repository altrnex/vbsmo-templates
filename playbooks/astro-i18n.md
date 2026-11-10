# Astro i18n

Use when an Astro application needs more than one language. Applies to `astro-single-vm`. Astro has built-in i18n routing; no package is needed for the route layer.

1. Inspect `astro.config.ts`, existing pages and content, canonical links, and any current language switcher. Use exactly the requested languages and establish one default. Decide whether the default locale has a URL prefix.
2. Configure Astro's `i18n.locales`, `defaultLocale`, and routing policy. Add localized page paths and translated content. Keep `/api` and `/api/auth` outside localized page routing unless the application explicitly requires localized API paths.
3. Add navigation between corresponding language pages; set page `lang`, metadata, canonical and alternate-language links. Preserve form behavior and current data across locales.
4. Verify direct entry, reload, navigation, unknown locales, and both public page and API routes after a production build. Do not add languages or translations that were not requested.

Reference: [Astro i18n routing](https://docs.astro.build/en/guides/internationalization/).
