# Internationalisation with Paraglide (TanStack Start)

Use when the site needs more than one language. Applies to `tanstack-start-single-vm`. This follows TanStack's official `start-i18n-paraglide` example; check it against the installed versions.

1. Add pinned `@inlang/paraglide-js` (2.x) to `apps/web`. Create `apps/web/project.inlang/settings.json` (`baseLocale`, `locales`, `modules` for the message format plugin) and message files `apps/web/messages/<locale>.json` (flat `"key": "text"` entries).
2. In `apps/web/vite.config.ts` add `paraglideVitePlugin({ project: "./project.inlang", outdir: "./src/paraglide", outputStructure: "message-modules", strategy: ["url", "cookie", "preferredLanguage", "baseLocale"], urlPatterns: [...] })` before `tanstackStart()`. `urlPatterns` map `/` and `/:path(.*)?` to `/<locale>` and `/<locale>/:path(.*)?` per locale. Add `src/paraglide` to `.gitignore` and the Biome `files.includes` exclusions: it is generated.
3. In `src/router.tsx` add `rewrite: { input: ({ url }) => deLocalizeUrl(url), output: ({ url }) => localizeUrl(url) }` to `createRouter` (imports from `./paraglide/runtime`), so route files stay locale free.
4. Create `src/server.ts` that wraps the TanStack handler: `import handler from "@tanstack/react-start/server-entry"; import { paraglideMiddleware } from "./paraglide/server.js"; export default { fetch: (req: Request) => paraglideMiddleware(req, () => handler.fetch(req)) };`.
5. Use messages as `import { m } from "@/paraglide/messages"; m.some_key()`; set `<html lang={getLocale()}>` in the root route; switch language with `setLocale(locale)`.
6. Verify each locale URL renders its language on first load (view-source, not only after hydration), the switcher keeps the path, and `bun run build` passes. Server functions and `/api` keep working under a locale prefix.
