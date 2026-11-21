# shadcn-vue

Use the installed kit first, in `apps/web/resources/js/components/ui/`: alert, avatar, badge, breadcrumb, button, card, checkbox, collapsible, dialog, dropdown-menu, input, input-otp, label, navigation-menu, select, separator, sheet, sidebar, skeleton, sonner, spinner and tooltip. They are [shadcn-vue](https://www.shadcn-vue.com) components (style `new-york`, `components.json`) on reka-ui. `cn()` lives in `@/lib/utils`; icons come from `@lucide/vue`. The Sonner toaster is mounted in the app layouts and flash messages reach it through `resources/js/lib/flashToast.ts`.

Each component is a folder with an `index.ts` that exports its parts, for example `import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'`. Import from the folder, never from a part file.

## Theme

Change the semantic variables in `resources/css/app.css`: light values live in `:root`, dark values in `.dark`. Prefer variable changes to per-component colour overrides. The dark class is set by the kit's `useAppearance` composable, which the appearance settings page uses.

## Adding a component

The builder shell does not run the shadcn-vue CLI (`bunx shadcn-vue`, `npx`), so a component that is not installed is written by hand:

1. Take the component's source from the shadcn-vue repository (`apps/v4/registry/new-york-v4/ui/<name>` at a fixed commit, fetched with the research tools), keep its structure (an `index.ts` and one `.vue` file per part) and write it to `resources/js/components/ui/<name>/` with the write tool.
2. Resolve its imports: `cn` from `@/lib/utils`, local parts from `@/components/ui/...`, and its reka-ui import from the `reka-ui` package that is already installed. A component that needs another npm package: `bun add --cwd apps/web --exact --lockfile-only --ignore-scripts <package>@<version>`, then call `project_check` with `operation: "dependencies"`, which is the platform-owned frozen-lockfile install. Keep `apps/web/package.json` and the root `bun.lock` in the change. Never edit node_modules.
3. Use it in a page, then call `project_check` with `operation: "verify"` and look at the preview for console errors.

If no available tool can retrieve the source, report that blocker; do not invent the component.

## Verification outside the builder

After the feature works, from the starter root run `bun run lint`, `bun run build`, `bun run typecheck` and `bun run test`, after `bun install --frozen-lockfile` and `composer install` in `apps/web`. Test dialogs, sheets and focus in the browser; compilation alone does not prove hydration.

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
