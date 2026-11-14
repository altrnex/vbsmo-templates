import { expect, test } from "bun:test";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { buildSite, validateSite } from "./site.js";

const page = (body) =>
  `<!DOCTYPE html><html lang="en"><head><title>Test</title></head><body>${body}</body></html>`;

test("copies validated nested pages and assets, removes stale output and rejects broken targets, anchors and HTML", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "vbsmo-html-"));
  try {
    await mkdir(path.join(root, "about"));
    await writeFile(
      path.join(root, "index.html"),
      page(
        '<a href="./about/#details">About</a><img src="./logo.svg" alt="Logo">',
      ),
    );
    await writeFile(
      path.join(root, "about/index.html"),
      page('<h1 id="details">About</h1><a href="../">Home</a>'),
    );
    await writeFile(
      path.join(root, "logo.svg"),
      '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
    );
    await buildSite(root);
    expect(
      await readFile(path.join(root, "dist/about/index.html"), "utf8"),
    ).toContain("details");
    expect(await readFile(path.join(root, "dist/logo.svg"), "utf8")).toContain(
      "<svg",
    );
    await writeFile(path.join(root, "dist/stale.txt"), "stale");
    await buildSite(root);
    expect(await Bun.file(path.join(root, "dist/stale.txt")).exists()).toBe(
      false,
    );
    for (const [body, error] of [
      ['<a href="./missing.html">Missing</a>', "missing local target"],
      ['<a href="./about/#missing">Missing</a>', "missing anchor"],
      ['<img src="./missing.svg" alt="Missing">', "missing local target"],
      ["<p><div>Invalid</div></p>", "index.html:"],
    ]) {
      await writeFile(path.join(root, "index.html"), page(body));
      await expect(validateSite(root)).rejects.toThrow(error);
      await expect(buildSite(root)).rejects.toThrow(error);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
