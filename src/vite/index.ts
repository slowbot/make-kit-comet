import type { Plugin, UserConfig } from "vite";
import {
  serveUswdsAssets,
  type ServeUswdsAssetsOptions,
} from "./serve-uswds-assets.js";
import { redirectUswdsImageImports } from "./redirect-image-imports.js";
import { redirectUswdsImageImportsEsbuild } from "./redirect-image-imports-esbuild.js";

export {
  serveUswdsAssets,
  redirectUswdsImageImports,
  redirectUswdsImageImportsEsbuild,
};
export type { ServeUswdsAssetsOptions };

export interface CometMakeKitOptions {
  /**
   * Options forwarded to the `serveUswdsAssets()` middleware. Override
   * `uswdsRoot`, `urlPrefix`, or `cacheControl` here if defaults don't fit.
   */
  serveAssets?: ServeUswdsAssetsOptions;
  /**
   * Disable individual sub-plugins by name. Useful when you want the
   * Vite plugin but not the esbuild rewrite, or vice versa. Defaults
   * to all three enabled — recommended.
   */
  disable?: Array<"serveAssets" | "redirectImports" | "esbuildRedirect">;
  /**
   * If true (default), forces `optimizeDeps.force` so the esbuild plugin
   * applies on the next dev start without a manual cache clear. Set to
   * `false` if you've already managed that in your own config.
   */
  forceOptimizeDeps?: boolean;
}

/**
 * One-call Vite plugin that bundles the three Make-sandbox workarounds
 * the GDS Make Kit (Comet edition) needs. Drop it into your `plugins`
 * array alongside `react()` and that's the whole config:
 *
 * ```ts
 * import { defineConfig } from "vite";
 * import react from "@vitejs/plugin-react";
 * import { cometMakeKit } from "@nava/make-kit-comet/vite";
 *
 * export default defineConfig({
 *   plugins: [react(), cometMakeKit()],
 * });
 * ```
 *
 * Sub-plugins (each is also exported individually if you need finer control):
 *   1. `serveUswdsAssets()` — dev middleware serving `/uswds/*` from
 *      `node_modules/@uswds/uswds/dist/*` at request time.
 *   2. `redirectUswdsImageImports()` — Vite plugin rewriting
 *      `@uswds/uswds/img/*` JS imports to middleware-served URLs
 *      (catches app code imports).
 *   3. `redirectUswdsImageImportsEsbuild` — same rewrite during
 *      `optimizeDeps` pre-bundling (catches comet's compiled bundle).
 *
 * Removing any sub-plugin reintroduces a known sandbox bug. See
 * `MAKE-SANDBOX-WORKAROUNDS.md` in the source kit for the full story
 * and the rollback procedure for the day Figma Make loosens up.
 */
export function cometMakeKit(options: CometMakeKitOptions = {}): Plugin[] {
  const disabled = new Set(options.disable ?? []);
  const force = options.forceOptimizeDeps ?? true;
  const plugins: Plugin[] = [];

  if (!disabled.has("serveAssets")) {
    plugins.push(serveUswdsAssets(options.serveAssets));
  }
  if (!disabled.has("redirectImports")) {
    plugins.push(redirectUswdsImageImports());
  }
  if (!disabled.has("esbuildRedirect")) {
    plugins.push(esbuildRedirectInjector(force));
  }

  return plugins;
}

/**
 * Wraps the esbuild plugin in a tiny Vite plugin that runs at `config()`
 * time so the user doesn't have to wire it into `optimizeDeps` themselves.
 * Merges with any existing esbuild plugin list the user already has.
 */
function esbuildRedirectInjector(force: boolean): Plugin {
  return {
    name: "comet-make-kit:inject-esbuild-redirect",
    enforce: "pre",
    config(userConfig): UserConfig {
      const existingOptimize = userConfig.optimizeDeps ?? {};
      const existingEsbuild = existingOptimize.esbuildOptions ?? {};
      const existingPlugins = existingEsbuild.plugins ?? [];
      return {
        optimizeDeps: {
          ...existingOptimize,
          force: existingOptimize.force ?? force,
          esbuildOptions: {
            ...existingEsbuild,
            plugins: [
              ...existingPlugins,
              redirectUswdsImageImportsEsbuild as unknown as (typeof existingPlugins)[number],
            ],
          },
        },
      };
    },
  };
}
