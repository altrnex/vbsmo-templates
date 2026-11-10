import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  agentRules: false,
  turbopack: { root: fileURLToPath(new URL("../../", import.meta.url)) },
};

export default config;
