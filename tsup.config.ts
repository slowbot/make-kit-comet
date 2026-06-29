import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "vite/index": "src/vite/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2020",
  external: [
    "react",
    "react-dom",
    "vite",
    "@uswds/uswds",
    "@metrostar/comet-uswds",
    "node:fs",
    "node:path",
    "fs",
    "path",
  ],
});
