import { USWDS_IMG_RE } from "./redirect-image-imports.js";

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
    callback: (args: { path: string }) => { contents: string; loader: string },
  ) => void;
}

/**
 * esbuild plugin (drop-in for `optimizeDeps.esbuildOptions.plugins`) that
 * applies the same `@uswds/uswds/img/*` rewrite as the Vite plugin, but
 * during esbuild's `node_modules` pre-bundling. This catches imports
 * coming from inside comet's compiled bundle (e.g., comet's <Banner>
 * importing `us_flag_small.png`), which the regular Vite plugin sees
 * too late to intercept.
 *
 * The two plugins are paired in `cometMakeKit()`. Don't use this one in
 * isolation.
 */
export const redirectUswdsImageImportsEsbuild: EsbuildPlugin = {
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
        return {
          contents: `export default ${JSON.stringify("/uswds/img/" + filename)};`,
          loader: "js",
        };
      },
    );
  },
};
