import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

import type { NextConfig } from "next";

const root = fileURLToPath(new URL("../../", import.meta.url));

/** Same committed source (outside the platform's `infra/`), same build output. */
function sourceBuildId(): string {
  try {
    const tree = execFileSync("git", ["ls-tree", "HEAD"], {
      cwd: root,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const source = tree.split("\n").filter((line) => !line.endsWith("\tinfra"));
    return createHash("sha256").update(source.join("\n")).digest("hex").slice(0, 20);
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
