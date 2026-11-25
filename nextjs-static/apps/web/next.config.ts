import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const root = fileURLToPath(new URL("../../", import.meta.url));
/** Dependencies and build output, not source. */
const skipped = new Set([
  ".git",
  ".next",
  ".vbsmo-runtime",
  "node_modules",
  "out",
  "next-env.d.ts",
]);

/** The application's source files (outside the platform's `infra/` and the installed skills in `.agents/`), sorted. */
function sourceFiles(directory: string): string[] {
  return readdirSync(root + directory, { withFileTypes: true })
    .filter(
      ({ name }) =>
        !skipped.has(name) &&
        !name.endsWith(".tsbuildinfo") &&
        !["infra", ".agents"].includes(`${directory}${name}`),
    )
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .flatMap((entry) => {
      const file = `${directory}${entry.name}`;
      if (entry.isDirectory()) return sourceFiles(`${file}/`);
      return entry.isFile() ? [file] : [];
    });
}

/**
 * Same source, same build output: the id hashes the source's paths and
 * contents.
 */
function sourceBuildId(): string {
  try {
    const hash = createHash("sha256");
    for (const file of sourceFiles(""))
      hash
        .update(`${file}\0`)
        .update(readFileSync(root + file))
        .update("\0");
    return hash.digest("hex").slice(0, 20);
  } catch {
    return "vbsmo-static";
  }
}

const config: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  generateBuildId: sourceBuildId,
  turbopack: { root },
};

export default config;
