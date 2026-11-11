# Stateful Django application

Use `vbsmo` for short project prefixes. The Bun workspace keeps Django in `apps/web`. Preserve
`.vbsmo.json`, the workspace layout and platform-owned deployment inputs. This is a `single-vm`
application on Django 6.1.1, Python 3.14 and PostgreSQL 18. Use normal Django models, forms, views,
migrations, authentication and sessions. Do not use django-distill or serverless functions.

Read existing files first. Use the ordinary Django `path` function for routes. Keep `/healthz`
working. Keep settings driven by the maintained environment variables; never hardcode credentials,
production hostnames or preview prefixes. Use `{% url %}`, static tags and Django redirects so forms,
assets and navigation work at the application root. Include CSRF protection on state-changing forms.
Extend `base.html` for application pages; its `same-origin` referrer metadata enables native HTTPS
forms under the preview's default `no-referrer` response policy. Keep that metadata: it sends referrers
only to this application and never to Studio, sibling previews or third-party origins. Django's normal
CSRF token and exact Origin/Referer checks stay enabled; do not trust `null` origins or exempt forms.
Use Django authentication/authorization, password hashing and per-user filtering for private data.
Private uploads must pass through an authorized view; do not publish `/media` as static files.

Use Tailwind CSS 4 and the installed lucide-static icons. Keep styles in `assets/styles/site.css`;
`bun run lint:fix` regenerates static CSS. Preserve Ruff, djLint and Biome checks. Never suppress a
check to finish. Use Bun for JavaScript dependencies and tools. Python dependencies belong in
`apps/web/requirements.txt`; preserve pinned maintained dependencies. Every TypeScript package needs
`test`, `lint`, `lint:fix`, `typecheck` and a local tsconfig. Chain Hono methods if introducing Hono.

Create normal migrations for models. Production supports new models and nullable additive fields
without data backfills; destructive migrations, RunSQL/RunPython, custom operations, changed applied
migrations and database rollback are refused. Source restoration preserves later schema and records.
Never place runtime data, uploads, credentials or `.vbsmo-runtime` in source control.

Use `project_check environment` to discover customer variable names, never values. Run
`project_check migrations` after changing models, inspect the generated files, then run
`project_check verify` before finishing. Do not execute Python management commands through shell.
Use `project_config` to declare application environment names. It checks Django, tests against a separate database and
collects static assets. The platform supervises preview and PostgreSQL; do not start background
servers or reset preview data yourself. Explain that preview data is disposable when a workspace is
collected or replaced. Production data is separate. Account creation/recovery uses private Django
management commands; never seed a public/default password or first-visitor administrator.

Build the application the customer requests, with accessible controls, correct empty/error states,
and real database behavior. Keep project-specific handoff notes concise below after verification.

## Project record

- Purpose: Stateful Django starter, ready for the customer's application.
- Architecture: Django/PostgreSQL under apps/web; private development database and customer VM deployment.
- Routes: `/`, `/healthz`, `/sitemap.xml` and the custom 404 page.
