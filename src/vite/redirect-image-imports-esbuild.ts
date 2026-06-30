import path from "node:path";
import {
  USWDS_IMG_RE,
  resolveUswdsAsset,
  type UswdsImageMode,
} from "./redirect-image-imports.js";

interface EsbuildPlugin {
  name: string;
  setup: (build: EsbuildPluginBuild) => void;
}

interface EsbuildPluginBuild {
  onResolve: (
    options: { filter: RegExp },
    callback: (args: { path: string }) => { path: string; namespace: string },
  ) => void;
  onLoad: (
    options: { filter: RegExp; namespace?: string },
    callback: (args: { path: string }) =>
      | { contents: string; loader: string }
      | Promise<{ contents: string; loader: string }>,
  ) => void;
}

export interface RedirectUswdsImageImportsEsbuildOptions {
  mode?: UswdsImageMode;
  imgRoot?: string;
  urlPrefix?: string;
}

/**
 * esbuild plugin (drop-in for `optimizeDeps.esbuildOptions.plugins`) that
 * mirrors the Vite plugin's rewrite during esbuild's `node_modules`
 * pre-bundling. This catches imports coming from inside comet's compiled
 * bundle (e.g., comet's `<Banner>` importing `us_flag_small.png` and
 * the `<Icon>` sprite reference), which the regular Vite plugin sees
 * too late to intercept.
 *
 * Default mode (`"inline"`) emits `data:` URIs — required for Figma
 * Make's preview sandbox. Use `"url"` only when paired with a working
 * `serveUswdsAssets()` middleware in an unconstrained environment.
 *
 * The two plugins are paired in `cometMakeKit()`. Don't use this one
 * in isolation unless you know exactly which dep graph branch you're
 * trying to intercept.
 */
export function createRedirectUswdsImageImportsEsbuild(
  options: RedirectUswdsImageImportsEsbuildOptions = {},
): EsbuildPlugin {
  const mode = options.mode ?? "inline";
  const imgRoot = path.resolve(
    options.imgRoot ?? path.join(process.cwd(), "node_modules/@uswds/uswds/dist/img"),
  );
  const urlPrefix = options.urlPrefix ?? "/uswds";

  return {
    name: "comet-make-kit:redirect-uswds-image-imports-esbuild",
    setup(build) {
      build.onResolve({ filter: USWDS_IMG_RE }, (args) => ({
        path: args.path,
        namespace: "uswds-img-redirect",
      }));
      build.onLoad(
        { filter: /.*/, namespace: "uswds-img-redirect" },
        (args) => {
          const filename = args.path.replace("@uswds/uswds/img/", "");
          try {
            const value = resolveUswdsAsset(filename, imgRoot, mode, urlPrefix);
            return {
              contents: `export default ${value};`,
              loader: "js",
            };
          } catch {
            return {
              contents: `export default ${JSON.stringify(`${urlPrefix}/img/${filename}`)};`,
              loader: "js",
            };
          }
        },
      );
    },
  };
}

/**
 * Backwards-compatible default-mode esbuild plugin instance, exported
 * for callers that wired the previous shape (`redirectUswdsImageImportsEsbuild`)
 * directly into `optimizeDeps.esbuildOptions.plugins`. New consumers
 * should prefer `createRedirectUswdsImageImportsEsbuild({...})` for
 * mode and path overrides.
 */
export const redirectUswdsImageImportsEsbuild: EsbuildPlugin =
  createRedirectUswdsImageImportsEsbuild();
