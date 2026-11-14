# shadcn/ui

Use the installed kit first: button, input, label, textarea, card, dialog, dropdown-menu, select, tabs, sheet and sonner in `apps/web/src/components/ui/`. `cn()` lives in `@/lib/utils`. Sonner is mounted once in the root layout. Its wrapper uses system preference without a Next-specific theme provider; semantic CSS colours still follow the document theme.

## Source and theme contract

These are the Radix-based New York components from shadcn **4.23.0**, pinned to upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`. The immutable registry directory is:

`https://raw.githubusercontent.com/shadcn-ui/ui/96da9cc7f1aa10580a3741664e2a77c721206c00/apps/v4/public/r/styles/new-york/`

Each `<name>.json` contains `files[].content`, dependencies and any registry dependencies. Use that pinned source, not a moving registry or latest release. Keep the source's React client directives. The Sonner wrapper deliberately replaces next-themes with `theme="system"` so it works in both frameworks.

Change semantic variables in the global stylesheet (`src/app/globals.css` in Next; `src/styles/globals.css` in Astro). Light values live in `:root`, dark values in `.dark`; set the document's `.dark` class to select them. Tailwind mappings, portal surfaces and accordion animations already exist. Prefer variable changes to per-component colour overrides. No theme-switcher dependency is needed.

## Adding accordion inside the builder

The builder shell rejects both `bunx shadcn@4.23.0 add accordion` and `bun x shadcn@4.23.0 add accordion` before package execution. Do not wrap the CLI in another command or run npm/npx. Use write/edit plus the normal platform dependency path:

1. Read the pinned accordion source under **Accordion source** below. It is embedded because the current builder image has no `curl` binary; an allowed HTTP command alone does not prove that command is installed.
2. Use the harness write tool to save that TSX as `apps/web/src/components/ui/accordion.tsx`. Its imports are `@radix-ui/react-accordion`, `lucide-react`, React and `@/lib/utils`; only the first dependency is new. No registry dependencies are needed. Format the new source with the project's existing formatter if necessary.
3. Run this exact allowed command from the workspace root:

   `bun add --cwd apps/web --exact --lockfile-only --ignore-scripts @radix-ui/react-accordion@1.3.1`

4. Call `project_check` with `operation: "dependencies"`. This is the platform-owned frozen-lockfile install; direct `bun install` is unavailable in the shell. Keep both `apps/web/package.json` and the root `bun.lock` in the change. Never edit node_modules or execute downloaded files there.
5. Import `Accordion`, `AccordionItem`, `AccordionTrigger` and `AccordionContent` from `@/components/ui/accordion`. A minimal use is `<Accordion type="single" collapsible><AccordionItem value="help"><AccordionTrigger>Help</AccordionTrigger><AccordionContent>Your help text</AccordionContent></AccordionItem></Accordion>`.
6. In Next, use this interactive tree inside a `"use client"` component. In Astro, put the whole tree in one React component (for example `src/components/HelpAccordion.tsx`) and hydrate that component from the `.astro` page with `client:load`.
7. Call `project_check` with `operation: "verify"`, then open/close the accordion in preview and check console errors. Verify the existing Notes submission still works.

For another component, obtain its JSON from the immutable registry directory using an available research tool, inspect its files and recursively include its listed registry dependencies. Pin compatible npm dependencies explicitly using the same lockfile-only/install path. Do not assume curl exists. If no available tool can retrieve the pinned source, report that blocker; do not invent the component or bypass policy.

Sandbox evidence: a live flash-harness probe rejected `bunx shadcn@4.23.0 add accordion` with the shell allowlist error and returned `curl: command not found` for registry retrieval. Use the embedded-source recipe plus the platform dependency installer. The embedded-source path was proven in the builder sandbox with the flash harness: it wrote the pinned accordion source, ran the exact lockfile-only dependency command above, installed through `project_check dependencies`, and passed `project_check verify`; the accordion opened and closed in the Astro preview. No registry fetch or CLI execution is needed for this recipe.

## Accordion source

Copied from the immutable registry item above; keep its imports and exports.

```tsx
"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn("border-b", className)} {...props} />
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```

## Astro island rules

Static React UI can render on the server without a hydration directive. Use `client:load` for immediately available controls and `client:visible` for controls below the fold. Put Radix trigger, state, content and portal inside the same React island: separate islands cannot share React context. Do not pass React component functions as props from Astro. Never import database modules, Node-only code or server-only API implementations into an island; browser API clients may import the API type with `import type`. Keep Astro's server output, Node adapter and embedded Hono router unchanged. The starter's About notes dialog demonstrates the boundary.

## Verification outside the builder

After the feature works, from the template/workspace root run `bun run lint`, `bun run typecheck`, `bun run test` and `bun run build`. Astro typecheck runs `astro check`. Use `bun install --frozen-lockfile` in a fresh local copy. Test interactive portals and focus in the browser; compilation alone does not prove hydration. In the builder use `project_check` for installation and the full verification gate as above.

## Upstream component license

MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
