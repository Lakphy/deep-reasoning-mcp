import { defineConfig } from "@rslib/core";
import pkg from "./package.json";

export default defineConfig({
  lib: [
    {
      format: "esm",
      syntax: "es2021",
      dts: true,
    },
    {
      format: "cjs",
      syntax: "es2021",
    },
  ],
  source: {
    entry: {
      index: "./src/index.ts",
      sse: "./src/sse.ts",
    },
    define: {
      "process.env.APP_NAME": JSON.stringify(pkg.name),
      "process.env.APP_VERSION": JSON.stringify(pkg.version),
    },
  },
});
