# shadcn/ui

Use the installed kit first: button, input, label, textarea, card, dialog, dropdown-menu, select, tabs, sheet and sonner in `apps/web/src/components/ui/`. `cn()` lives in `@/lib/utils`. Sonner is mounted once in the root layout. Its wrapper uses system preference without a Next-specific theme provider; semantic CSS colours still follow the document theme.

## Source and theme contract

These are the Radix-based New York components from shadcn **4.23.0**, pinned to upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`. The immutable registry directory is:

`https://raw.githubusercontent.com/shadcn-ui/ui/96da9cc7f1aa10580a3741664e2a77c721206c00/apps/v4/public/r/styles/new-york/`

Each `<name>.json` contains `files[].content`, dependencies and any registry dependencies. Use that pinned source, not a moving registry or latest release. Keep the source's React client directives. The Sonner wrapper deliberately replaces next-themes with `theme="system"` so it works in both frameworks.

Change semantic variables in the global stylesheet (`src/app/globals.css` in Next; `src/styles/globals.css` in Astro). Light values live in `:root`, dark values in `.dark`; set the document's `.dark` class to select them. Tailwind mappings, portal surfaces and accordion animations already exist. Prefer variable changes to per-component colour overrides. No theme-switcher dependency is needed.

## Adding accordion inside the builder

The builder shell rejects both `bunx shadcn@4.23.0 add accordion` and `bun x shadcn@4.23.0 add accordion` before package execution. Do not wrap the CLI in another command or run npm/npx. Use write/edit plus the normal platform dependency path:

1. From the workspace root, read the pinned registry item:

   `curl -fsSL https://raw.githubusercontent.com/shadcn-ui/ui/96da9cc7f1aa10580a3741664e2a77c721206c00/apps/v4/public/r/styles/new-york/accordion.json`

2. Use the harness write tool to save the JSON item's `files[0].content` verbatim as `apps/web/src/components/ui/accordion.tsx`. Do not save the JSON wrapper as TSX. Its imports are `@radix-ui/react-accordion`, `lucide-react`, React and `@/lib/utils`; only the first dependency is new. No registry dependencies are needed. Format the new source with the project's existing formatter if necessary.
3. Run this exact allowed command from the workspace root:

   `bun add --cwd apps/web --exact --lockfile-only --ignore-scripts @radix-ui/react-accordion@1.3.1`

4. Call `project_check` with `operation: "dependencies"`. This is the platform-owned frozen-lockfile install; direct `bun install` is unavailable in the shell. Keep both `apps/web/package.json` and the root `bun.lock` in the change. Never edit node_modules or execute downloaded files there.
5. Import `Accordion`, `AccordionItem`, `AccordionTrigger` and `AccordionContent` from `@/components/ui/accordion`. A minimal use is `<Accordion type="single" collapsible><AccordionItem value="help"><AccordionTrigger>Help</AccordionTrigger><AccordionContent>Your help text</AccordionContent></AccordionItem></Accordion>`.
6. In Next, use this interactive tree inside a `"use client"` component. In Astro, put the whole tree in one React component (for example `src/components/HelpAccordion.tsx`) and hydrate that component from the `.astro` page with `client:load`.
7. Call `project_check` with `operation: "verify"`, then open/close the accordion in preview and check console errors. Verify the existing Notes submission still works.

For another component, inspect its pinned JSON, recursively include its listed registry dependencies and pin compatible npm dependencies explicitly using the same lockfile-only/install path. If the pinned source cannot be retrieved, report that blocker; do not invent the component or bypass policy.

Sandbox evidence: policy classification proves the CLI is denied and the curl/dependency commands are allowed. The network boundary permits public IPv4 HTTPS, but live source retrieval and dependency installation must be verified in the branch's dev-test before delivery.

## Astro island rules

Static React UI can render on the server without a hydration directive. Use `client:load` for immediately available controls and `client:visible` for controls below the fold. Put Radix trigger, state, content and portal inside the same React island: separate islands cannot share React context. Do not pass React component functions as props from Astro. Never import database modules, Node-only code or server-only API implementations into an island; browser API clients may import the API type with `import type`. Keep Astro's server output, Node adapter and embedded Hono router unchanged. The starter's About notes dialog demonstrates the boundary.

## Verification outside the builder

After the feature works, from the template/workspace root run `bun run lint`, `bun run typecheck`, `bun run test` and `bun run build`. Astro typecheck runs `astro check`. Use `bun install --frozen-lockfile` in a fresh local copy. Test interactive portals and focus in the browser; compilation alone does not prove hydration. In the builder use `project_check` for installation and the full verification gate as above.
