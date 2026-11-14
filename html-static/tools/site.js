import { cp, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HtmlValidate } from "html-validate";
import { parse } from "parse5";

async function filesIn(root, directory = root) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (directory === root && entry.name === "dist") continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await filesIn(root, file)));
    else if (entry.isFile()) files.push(file);
    else throw new Error(`Unsupported site entry: ${file}`);
  }
  return files;
}

function elements(node) {
  return [
    ...(node.tagName ? [node] : []),
    ...(node.childNodes ?? []).flatMap(elements),
    ...(node.content ? elements(node.content) : []),
  ];
}

export async function validateSite(root) {
  root = path.resolve(root);
  const files = await filesIn(root);
  if (!files.includes(path.join(root, "index.html")))
    throw new Error("apps/web/index.html is required");
  const validator = new HtmlValidate({
    extends: ["html-validate:recommended"],
  });
  const pages = new Map();
  for (const file of files.filter((file) => file.endsWith(".html"))) {
    const source = await readFile(file, "utf8");
    const report = await validator.validateString(source, file);
    if (!report.valid)
      throw new Error(
        report.results
          .flatMap((result) =>
            result.messages.map(
              (message) =>
                path.relative(root, file) +
                ":" +
                message.line +
                ":" +
                message.column +
                " " +
                message.message,
            ),
          )
          .join("\n"),
      );
    const nodes = elements(parse(source));
    pages.set(file, {
      ids: new Set(
        nodes.flatMap((node) =>
          node.attrs
            .filter((attr) => attr.name === "id")
            .map((attr) => attr.value),
        ),
      ),
      references: nodes.flatMap((node) =>
        node.attrs
          .filter((attr) => ["href", "src", "poster"].includes(attr.name))
          .map((attr) => attr.value),
      ),
    });
  }
  for (const [file, page] of pages) {
    for (const reference of page.references) {
      if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference)) continue;
      const url = new URL(
        reference,
        "https://site.invalid/" +
          path.relative(root, file).split(path.sep).join("/"),
      );
      const targetPath = decodeURIComponent(url.pathname).replace(/^\/+/, "");
      let target = path.resolve(root, targetPath);
      if (target !== root && !target.startsWith(root + path.sep))
        throw new Error(`${file}: link escapes site: ${reference}`);
      const details = await stat(target).catch(() => undefined);
      if (details?.isDirectory()) target = path.join(target, "index.html");
      if (!files.includes(target))
        throw new Error(
          `${path.relative(root, file)}: missing local target ${reference}`,
        );
      const fragment = decodeURIComponent(url.hash.slice(1));
      if (fragment && pages.has(target) && !pages.get(target).ids.has(fragment))
        throw new Error(
          `${path.relative(root, file)}: missing anchor ${reference}`,
        );
    }
  }
}

export async function buildSite(root) {
  await validateSite(root);
  const output = path.join(root, "dist");
  await rm(output, { recursive: true, force: true });
  for (const file of await filesIn(root))
    await cp(file, path.join(output, path.relative(root, file)));
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const root = path.resolve("apps/web");
  if (process.argv[2] === "build") {
    const lint = Bun.spawnSync(["bun", "run", "biome", "check", "."], {
      stdout: "inherit",
      stderr: "inherit",
    });
    if (lint.exitCode !== 0) process.exit(lint.exitCode);
    await buildSite(root);
  } else await validateSite(root);
}
