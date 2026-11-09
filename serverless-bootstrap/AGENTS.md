# Application API

The website is in apps/web and the independent API is in functions/api. Both are ordinary local
processes started by root `bun run dev`; no cloud account or emulator is needed. Studio prepares
a checked source snapshot and activates it after the generation is accepted. Use `project_check
functions` for status/logs and `project_check api` to exercise that accepted revision.

The starter form sends JSON `{ name }` to `POST /v1/hello` and displays `{ message }`. It does
not save or send submissions. Adapt or remove this example to fit the customer's actual request;
do not add an unrelated greeting form to every site. Give each API-backed form a stable
`data-vbsmo-route` identifier matching its declaration, initially `hello.submit`.
Use `apiUrl("/v1/hello")` from apps/web/src/api.ts (Astro) or static/js/api.js (Django).
It uses `/api/` at the application root during preview and the deployed API origin after publishing.

Forms must perform the action their labels promise. For API-backed forms, implement the matching
handler and call it through apiUrl; show pending, success and error states from the actual response.
A demo needs only a real validate-and-respond API call: label it as a demo and state that nothing
is emailed or saved. Do not require a delivery service for a demo. Do not replace the call with
mailto, an alert, or a hard-coded success message. Actual sending/storage needs a configured service;
ask for that setup only when the customer requests real delivery. Never invent recipients or credentials.
If the brief does not need a contact form, do not add a nonfunctional one for decoration.

Keep `GET /v1/health/` and its `health.read` declaration. It returns `{ status: "ok" }` and
provides the public API link shown in Studio's Domain section.

Keep application logic in index.ts (Hono) or index.py (FastAPI), not in static-page endpoints.
Validate input with Zod or Pydantic and return JSON errors. Use small functions and ordinary
dependencies. Always chain Hono route methods; compose child routers with .route() and preserve
the inferred type. The TypeScript app uses .basePath("/v1"); Python route paths include /v1.

.vbsmo.json declares full public paths including the /v1 prefix, allowed methods and environment names.
Read it before changing a route. In Studio use project_config to update the route/environment
arrays; preserve platform-owned fields. Never put environment values in source, prompts, browser
assets or logs. Direct users to Application settings for values. Local exported projects may use
their own ignored environment files as described in the README.

Read declared variables and secrets through `process.env.NAME` in TypeScript/Node.js or
`os.environ["NAME"]` in Python (`os.getenv("NAME")` for optional settings). Hono `c.env` contains
request bindings; these runtimes do not supply application environment values there. Cloud adapters
load declared values into the process environment before importing application modules.

Test environment-dependent behavior with a non-empty synthetic process value and assert the
resulting behavior; an empty-value test alone can pass when the application reads the wrong place.
Restore the previous process value after each test, including removing a previously unset name.
If a module reads configuration at import time, set the test value before importing it.

OpenTofu owns resource configuration; deployment uses ordinary Tofu and provider CLI commands.
Do not add bundlers, deployment engines, hidden SDKs, automatic recovery or compatibility paths.
CAPTCHA is not implemented. Declare any route requiring it with captcha: required; deployed ingress
rejects those routes. Never introduce a NODE_ENV bypass for a cloud route. The anonymous local
preview does not implement CAPTCHA.

Run the normal lint, test, typecheck and build commands. Do not suppress lint, hide source files,
start background servers or change Git metadata; Studio owns the live process and Git lifecycle.
Update the root AGENTS.md project record after completing the requested work, then use
project_check verify.
