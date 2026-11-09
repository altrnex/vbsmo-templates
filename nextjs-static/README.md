# Next.js static site

This Bun workspace uses Next.js 16.4.5, React, TypeScript and Tailwind CSS 4.
The website lives in `apps/web` and uses the App Router in `src/app`.

Run `bun install --frozen-lockfile`, then `bun run dev` to edit locally.
Run `bun run lint`, `bun run typecheck`, `bun run test` and `bun run build` before publishing.
`next build` exports the site to `apps/web/out`, ready for static hosting.

Preview, local development and public exports serve from `/`. Use ordinary root-relative paths.

Pages are rendered at build time. Interactive client components are supported.
Request-time rendering, Server Actions, cookies, middleware/proxy, ISR and runtime API
routes are unavailable in this static template. Dynamic page segments must declare
`generateStaticParams`. Images are unoptimized because hosting has no Next.js server.
