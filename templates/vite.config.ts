// Drop-in Vite config for Figma Make projects using @slowbot/make-kit-comet.
// `cometMakeKit()` bundles the three Make-sandbox workarounds (USWDS asset
// middleware, image-import rewrite, esbuild rewrite). Removing it will
// reintroduce known sandbox bugs. See the package README and the source
// kit's MAKE-SANDBOX-WORKAROUNDS.md for the rollback procedure for the
// day Figma Make loosens up.

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cometMakeKit } from "@slowbot/make-kit-comet/vite";

export default defineConfig({
  plugins: [react(), cometMakeKit()],
});
