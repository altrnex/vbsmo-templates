# Laravel single-VM application

This Bun workspace holds one Laravel 13 application (PHP 8.5) in `apps/web`, with Inertia 3, React 19 and TypeScript, built with plain Vite. PostgreSQL 18 is the only database. Your training data describes older Laravel versions; follow these rules.

Laravel 13 structure:
- There is no `app/Http/Kernel.php`. Middleware, routing and exceptions are configured in `bootstrap/app.php`; providers are listed in `bootstrap/providers.php`. Do not remove `trustProxies(at: '*')`: the preview and production sit behind a proxy.
- Create files with `php artisan make:model|migration|controller|request|test ... --no-interaction`. Add a new migration for every schema change; never edit or delete one that exists. Migrations are written by hand: there is nothing to generate.
- Use Eloquent models and Form Requests (`make:request`) and named routes. Read configuration only through `config()`; call `env()` only inside `config/`.
- Sign-in is Laravel Fortify (`config/fortify.php`, `app/Providers/FortifyServiceProvider.php`): `/login`, `/register` and `/logout` already work and render `resources/js/pages/auth/*.tsx`. Do not install a starter kit, Breeze, Jetstream, Sanctum or Socialite, and do not write your own login.

Inertia 3 with React:
- A controller returns `Inertia::render('page-name', [...])`; pages are TypeScript files in `resources/js/pages` (`home.tsx` renders `page-name` = `home`, `auth/login.tsx` renders `auth/login`). Shared props are set in `app/Http/Middleware/HandleInertiaRequests.php`.
- Forms use the `<Form action="/path" method="post">` component from `@inertiajs/react`, which sends the CSRF token and shows validation errors. Do not write `fetch` or `axios` calls for forms and do not add a separate JSON API.
- There is no hot reload: the preview rebuilds the frontend on every save; reload the page.

Platform:
- The platform provides the preview PostgreSQL (`config/database.php` reads it). Never run `initdb`, start a PostgreSQL, switch to SQLite (only tests use SQLite) or seed or reset an existing database. Apply migrations with the `project_check` tool.
- Do not start `php artisan serve` or any dev server: the platform previews the app. Do not run `composer update`, `npm` or `npx`.
- Sessions use `SameSite=None; Secure` cookies because the preview is framed; do not change them and do not disable CSRF protection.
- Keep the root `bun.lock` and `apps/web/composer.lock` synchronized with the dependencies, and pin exact versions.

Quality (run after the requested feature works, and fix everything they report): `project_check` with `verify` runs Pint, Larastan (level 5, `phpstan.neon`), PHPUnit (`vendor/bin/phpunit`, not `php artisan test`, which warns when `.env` is missing), `tsc` and the Vite build. Add a feature test in `tests/Feature` for every route you add. The checks must print nothing.

UI uses the preinstalled shadcn/ui components in `apps/web/resources/js/components/ui`; read `docs/playbooks/shadcn-ui.md` before adding components. Colours live in `apps/web/resources/css/app.css` as neutral placeholders; replace them with the site's palette and fonts.

## File map

Edit: `apps/web/routes/web.php`, `apps/web/app/Http/Controllers`, `app/Models`, `app/Http/Requests`, `database/migrations`, `resources/js/pages` (one file per page), `resources/js/components` (the header and navigation are in `components/layout.tsx`), `resources/css/app.css`, `tests/Feature`.
Plumbing, no reading needed for ordinary work: `bootstrap/`, `config/`, `vite.config.ts`, `tsconfig.json`, `phpstan.neon`, `composer.*`, `package.json` files, `Dockerfile*`, `Caddyfile*`, `compose.yaml`, `.vbsmo.json`, `bun.lock`.

## Site shape and starter leftovers

Build only what the request asks for, with the smallest set of files: do not add queues, jobs, a scheduler, events, notifications, mail, policies, API resources, repositories or service layers, and do not add features nobody requested. A site is a multi-page application: its sections are separate routes and pages (home, about, contact; the pages follow from the request) with the header and footer in `components/layout.tsx`.
The home page (`NoteController`, `home.tsx`, the `notes` table) is a Notes demo that shows the data path; the layout's title ("Your new site") and unstyled header are placeholders. Replace them and choose the visual design from the request. A site with no stored data needs no table, controller logic or migration. Do not look for or copy files of other starters (`packages/db`, drizzle, `src/routes`, TanStack, Next.js): they do not exist here.
