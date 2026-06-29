import type { Plugin } from "vite";

export const USWDS_IMG_RE = /^@uswds\/uswds\/img\/(.+\.(png|svg|jpe?g|gif|webp))$/;

/**
 * Vite plugin that rewrites `import x from "@uswds/uswds/img/foo.png"` to
 * a virtual module exporting the URL `/uswds/img/foo.png`. That URL is
 * served by the `serveUswdsAssets()` middleware in the same plugin pair.
 *
 * Without this rewrite, Vite resolves the bare import to a `/@fs/` path
 * that Figma Make's preview sandbox blocks, breaking the US flag in
 * comet's <Banner> (the asset is a `.png` import) and any other USWDS
 * image asset referenced from JS.
 *
 * Catches imports from app source code. For imports from inside
 * pre-bundled `node_modules` (comet's bundle), pair with
 * `redirectUswdsImageImportsEsbuild` in `optimizeDeps.esbuildOptions.plugins`.
 */
export function redirectUswdsImageImports(): Plugin {
  return {
    name: "comet-make-kit:redirect-uswds-image-imports",
    enforce: "pre",
    resolveId(id) {
      if (USWDS_IMG_RE.test(id)) return "\0" + id;
      return null;
    },
    load(id) {
      if (id.startsWith("\0") && USWDS_IMG_RE.test(id.slice(1))) {
        const filename = id.slice(1).replace("@uswds/uswds/img/", "");
        return `export default ${JSON.stringify("/uswds/img/" + filename)};`;
      }
      return null;
    },
  };
}
