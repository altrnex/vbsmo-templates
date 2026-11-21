# shadcn/ui

Use the installed kit first: button, input, label, textarea, card, dialog, dropdown-menu, select, tabs, sheet and sonner in `apps/web/resources/js/components/ui/`. `cn()` lives in `@/lib/utils`. Sonner is mounted once in `resources/js/app.tsx`.

## Source and theme contract

These are the Tailwind 4 Radix-based New York components from shadcn **4.23.0**, pinned to upstream commit `96da9cc7f1aa10580a3741664e2a77c721206c00`. The immutable registry directory is:

`https://raw.githubusercontent.com/shadcn-ui/ui/96da9cc7f1aa10580a3741664e2a77c721206c00/apps/v4/registry/new-york-v4/ui/`

Use the pinned `<name>.tsx` source, not a moving registry or latest release. Resolve its local UI imports to `@/components/ui/` and its `cn` import to `@/lib/utils`; keep its React client directives. The Sonner wrapper uses inline colour variables from the document theme without next-themes, so toast backgrounds, borders and text follow both `:root` and `.dark`.

Change semantic variables in the global stylesheet (`resources/css/app.css`). Light values live in `:root`, dark values in `.dark`; set the document's `.dark` class to select them. Tailwind mappings, portal surfaces and accordion animations already exist. Prefer variable changes to per-component colour overrides. No theme-switcher dependency is needed.

## Adding accordion inside the builder

The builder shell rejects both `bunx shadcn@4.23.0 add accordion` and `bun x shadcn@4.23.0 add accordion` before package execution. Do not wrap the CLI in another command or run npm/npx. Use write/edit plus the normal platform dependency path:

1. Read the pinned accordion source under **Accordion source** below. It is embedded because the current builder image has no `curl` binary; use the embedded source without a registry fetch.
2. Use the harness write tool to save that TSX as `apps/web/resources/js/components/ui/accordion.tsx`. Its imports are `radix-ui`, `lucide-react`, React and `@/lib/utils`, already installed by the core kit. The command below keeps the shared Radix dependency pinned; adding the component does not require another package. Format the new source with the project's existing formatter if necessary.
3. Run this exact allowed command from the workspace root:

   `bun add --cwd apps/web --exact --lockfile-only --ignore-scripts radix-ui@1.8.1`

4. Call `project_check` with `operation: "dependencies"`. This is the platform-owned frozen-lockfile install; direct `bun install` is unavailable in the shell. Keep both `apps/web/package.json` and the root `bun.lock` in the change. Never edit node_modules or execute downloaded files there.
5. Import `Accordion`, `AccordionItem`, `AccordionTrigger` and `AccordionContent` from `@/components/ui/accordion`. A minimal use is `<Accordion type="single" collapsible><AccordionItem value="help"><AccordionTrigger>Help</AccordionTrigger><AccordionContent>Your help text</AccordionContent></AccordionItem></Accordion>`.
6. Use the interactive tree inside an ordinary React component in a page.
7. Call `project_check` with `operation: "verify"`, then open/close the accordion in preview and check console errors. Verify the existing Notes submission still works.

For another component, obtain its TSX from the immutable source directory using an available research tool, inspect its imports and include any referenced local UI components. Pin compatible npm dependencies explicitly using the same lockfile-only/install path. If no available tool can retrieve the pinned source, report that blocker; do not invent the component or bypass policy.

## Accordion source

Copied from the immutable Tailwind 4 source above, with the cn import resolved to this template; keep its imports and exports.

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";
import { Accordion as AccordionPrimitive } from "radix-ui";

function Accordion({ ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-b last:border-b-0", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "flex flex-1 items-start justify-between gap-4 rounded-md py-4 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180",
          className,
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="pointer-events-none size-4 shrink-0 translate-y-0.5 text-muted-foreground transition-transform duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn("pt-0 pb-4", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
```


## Verification outside the builder

After the feature works, from the template/workspace root run `bun run lint`, `bun run typecheck`, `bun run test` and `bun run build`. Use `bun install --frozen-lockfile` in a fresh local copy. Test interactive portals and focus in the browser; compilation alone does not prove hydration. In the builder use `project_check` for installation and the full verification gate as above.

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
