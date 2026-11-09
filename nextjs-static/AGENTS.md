# Next.js static site builder

Build the customer's site in this Bun workspace. Use `vbsmo` for short project prefixes.
Use the official Next.js 16 App Router documentation for unfamiliar APIs.
The framework version is pinned below; do not infer APIs from older examples.

## Stack and boundaries

- Next.js 16.4.5 App Router, React, TypeScript, Tailwind CSS 4 and Lucide React icons
  are installed. Keep site source in `apps/web/src/app` and reusable components in
  `apps/web/src/components`. Import shared styles through the root layout.
- This application exports static HTML. Preserve `output: "export"`, `trailingSlash`,
  `images.unoptimized` and workspace Turbopack root
  in `next.config.ts`. The platform owns preview servers and exports.
- Use Server Components for build-time rendering and small `"use client"` components
  for state, browser APIs and interactions. All customer-facing routes must export.
  For dynamic segments declare all paths with `generateStaticParams`; never rely
  on request-time route generation or `dynamicParams: true`.
- No Server Actions, cookies, request-time rendering, ISR, middleware/proxy or
  runtime API routes. Never fake a working backend or successful form submission.
  Add runtime network calls only when the customer requests that integration.
- Use `@/` imports for source under `apps/web/src`; the local tsconfig defines that alias.
- Use `next/image` for photos, with descriptive alt text and either width/height or
  `fill` with a positioned parent and appropriate `sizes`. Unoptimized export is
  already configured. Do not use raw `<img>` tags.
- Keep same-page section links as `#section`. For sections on another page use
  `next/link` with `href="/#section"`. Never use
  placeholder `href="#"`; actions use buttons.
- Use `next/link` for internal navigation with normal root-relative hrefs. Public assets and
  next/image sources also use ordinary root-relative paths. Preview and deployment serve from `/`.
- Use local/system fonts or supplied local font files. Avoid build-time font downloads.
  Use `lucide-react` for interface icons rather than copying SVG paths.

## Product standard

Use the language of the request for site content. A single-page request stays one page.
Create a complete, responsive site proportional to the request. Provide meaningful
content, consistent spacing, typography, accessible colour contrast, keyboard focus
and working navigation. Use semantic HTML, descriptive labels and useful empty/error
states. Keep `src/app/not-found.tsx` with a link home. Set suitable page metadata;
never invent a canonical hosting URL. Use real supplied assets or the images tool
when appropriate. Do not show framework or platform implementation details in the site.

## Working rules

- Read existing source before editing. Preserve useful work and platform-owned
  `.vbsmo.json` fields. Never touch Git metadata or suppress lint failures.
- Use Bun, never npm/npx/Yarn/pnpm or `bun x`. Add/remove packages with
  `bun --cwd apps/web add` / `remove` so the root lockfile stays synchronized.
- Use `project_check environment` to inspect configured variable names, never values.
  Keep secrets out of client code, HTML, logs and documentation requests. Only
  intentionally public values may be embedded in client assets.
- Keep each TypeScript package's test, lint, lint:fix and typecheck scripts and
  local tsconfig. Always chain Hono methods if composing a Hono app or example.
- Finish with `project_check verify`. Never start servers, commit or push; the
  platform handles these operations. Do not weaken checks to make verification pass.
