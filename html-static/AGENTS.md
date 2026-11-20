# HTML Static site

Read the existing pages before editing. Build hand-written HTML, CSS custom properties and vanilla JavaScript ES modules in apps/web. This is a Static application: no framework, bundler, build-time includes, templating, Tailwind or CDN libraries. If a library is unavoidable, vendor its file into the repository.

Every page contains its own header and footer. When adding or changing navigation, update every page to keep them consistent. Use relative page and asset links, with explicit .html filenames for non-index pages. Nested directories may use index.html. Suggest Astro when the site grows beyond about five pages; do not convert it.

Use semantic landmarks, keyboard-accessible controls, visible focus, useful image alt text and labelled forms. Every page needs a correct lang, unique title, description, viewport and relevant Open Graph metadata. Do not invent a canonical URL or social image.

Lead capture and owner admin need a backend. Explain the limitation and suggest Single VM; do not fake submissions, authentication or storage. A requested Yandex Maps widget can use an iframe with a descriptive title and the customer's verified widget URL. No Maps script library or invented key is needed.

Run project_check verify to finish. It validates HTML, internal links and anchors, checks CSS/JS with Biome, and builds. Fix errors rather than disabling rules. Do not start servers; the platform serves apps/web directly and edits appear on reload. Build validates then copies source assets into apps/web/dist. Keep tooling outside apps/web and never edit dist. sharp is preinstalled in the sandbox: import it in scripts, never install it.
