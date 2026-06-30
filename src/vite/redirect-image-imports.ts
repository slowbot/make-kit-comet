import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

export const USWDS_IMG_RE = /^@uswds\/uswds\/img\/(.+\.(png|svg|jpe?g|gif|webp))$/;

export type UswdsImageMode = "inline" | "url";

export interface RedirectUswdsImageImportsOptions {
  /**
   * `"inline"` (default) reads the asset off disk at build/dev time and
   * emits it as a `data:` URI export. Bypasses all network/proxy paths
   * — required for Figma Make's preview sandbox, which blocks or
   * misroutes direct asset URLs even when a dev middleware serves them.
   *
   * `"url"` falls back to the previous behavior: emit a `/uswds/img/*`
   * string that the paired `serveUswdsAssets()` middleware will serve.
   * Use this only in environments where the middleware is reachable
   * (vanilla Vite, no preview proxy) and you want to avoid bundling
   * SVG/PNG bytes into the JS graph.
   */
  mode?: UswdsImageMode;
  /**
   * Root directory of the installed `@uswds/uswds` package's `dist/img`.
   * Defaults to `<cwd>/node_modules/@uswds/uswds/dist/img`. Override
   * for non-standard installs (pnpm workspaces, yarn pnp, monorepos).
   */
  imgRoot?: string;
  /**
   * URL prefix used when `mode: "url"`. Must match
   * `serveUswdsAssets({ urlPrefix })`. Defaults to `/uswds`.
   */
  urlPrefix?: string;
}

const MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
};

export function resolveUswdsAsset(
  filename: string,
  imgRoot: string,
  mode: UswdsImageMode,
  urlPrefix: string,
): string {
  if (mode === "url") {
    return JSON.stringify(`${urlPrefix}/img/${filename}`);
  }
  const filePath = path.join(imgRoot, filename);
  const ext = path.extname(filePath).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  const bytes = fs.readFileSync(filePath);
  // base64 for everything (including SVG): bulletproof against
  // fragment-after-data-URI parsing quirks, XML prologs like `<?xml ?>`,
  // and any non-ASCII glyphs. Costs ~33% size vs raw utf8 — acceptable
  // for the predictability win. `<use href="data:image/svg+xml;base64,…#icon">`
  // is spec-compliant and works in all current engines.
  return JSON.stringify(`data:${mime};base64,${bytes.toString("base64")}`);
}

/**
 * Vite plugin that rewrites `import x from "@uswds/uswds/img/foo.svg"`
 * into a virtual module whose default export is either:
 *   - a `data:` URI (default, `mode: "inline"`) — bytes inlined into the
 *     JS graph, no network request, works in Figma Make's sandbox.
 *   - a `/uswds/img/foo.svg` URL string (`mode: "url"`) — paired with
 *     `serveUswdsAssets()` middleware, smaller bundle, requires a
 *     well-behaved proxy.
 *
 * Without this rewrite, Vite resolves the bare import to a `/@fs/` path
 * that Figma Make's preview sandbox blocks, breaking the US flag in
 * comet's <Banner> (a `.png` import), the comet <Icon> component sprite
 * lookups, and any other USWDS image asset referenced from JS.
 *
 * Catches imports from app source code. For imports from inside
 * pre-bundled `node_modules` (comet's bundle), pair with
 * `redirectUswdsImageImportsEsbuild` in `optimizeDeps.esbuildOptions.plugins`.
 */
export function redirectUswdsImageImports(
  options: RedirectUswdsImageImportsOptions = {},
): Plugin {
  const mode = options.mode ?? "inline";
  const imgRoot = path.resolve(
    options.imgRoot ?? path.join(process.cwd(), "node_modules/@uswds/uswds/dist/img"),
  );
  const urlPrefix = options.urlPrefix ?? "/uswds";

  return {
    name: "comet-make-kit:redirect-uswds-image-imports",
    enforce: "pre",
    resolveId(id) {
      if (USWDS_IMG_RE.test(id)) return "\0" + id;
      return null;
    },
    load(id) {
      if (!id.startsWith("\0")) return null;
      const real = id.slice(1);
      const match = USWDS_IMG_RE.exec(real);
      if (!match) return null;
      const filename = real.replace("@uswds/uswds/img/", "");
      try {
        const value = resolveUswdsAsset(filename, imgRoot, mode, urlPrefix);
        return `export default ${value};`;
      } catch (err) {
        const reason = err instanceof Error ? err.message : String(err);
        this.warn(
          `[comet-make-kit] could not inline @uswds/uswds/img/${filename}: ${reason}. Falling back to URL.`,
        );
        return `export default ${JSON.stringify(`${urlPrefix}/img/${filename}`)};`;
      }
    },
  };
}
