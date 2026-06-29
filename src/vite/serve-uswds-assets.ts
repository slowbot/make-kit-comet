import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const DEFAULT_MIME: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
  ".eot": "application/vnd.ms-fontobject",
  ".css": "text/css",
  ".js": "application/javascript",
};

export interface ServeUswdsAssetsOptions {
  /**
   * Root directory of the installed `@uswds/uswds` package. Defaults to
   * `<cwd>/node_modules/@uswds/uswds/dist`. Override if your tooling
   * resolves USWDS from a non-standard location (pnpm workspaces, yarn
   * pnp, etc.).
   */
  uswdsRoot?: string;
  /**
   * URL prefix the middleware listens on. Defaults to `/uswds`. The
   * Simpler theme CSS references `/uswds/img/*` and `/uswds/fonts/*`
   * paths, so changing this requires rebuilding the theme bundle.
   */
  urlPrefix?: string;
  /**
   * Cache-Control header value for served assets. Defaults to
   * `public, max-age=3600` for dev. Production builds bundle the CSS
   * and never hit this middleware.
   */
  cacheControl?: string;
}

/**
 * Dev middleware that serves USWDS assets (icons, sprites, fonts) directly
 * from `node_modules/@uswds/uswds/dist/` at request time. Bypasses the
 * `public/` folder, which doesn't reliably persist in Figma Make's preview.
 *
 * Without this plugin, the precompiled Simpler theme CSS would 404 on every
 * `/uswds/img/*.svg` and `/uswds/fonts/*.woff2` reference, breaking the
 * Alert icon, button sprites, body font, etc.
 */
export function serveUswdsAssets(options: ServeUswdsAssetsOptions = {}): Plugin {
  const uswdsRoot = path.resolve(
    options.uswdsRoot ?? path.join(process.cwd(), "node_modules/@uswds/uswds/dist"),
  );
  const urlPrefix = options.urlPrefix ?? "/uswds";
  const cacheControl = options.cacheControl ?? "public, max-age=3600";

  return {
    name: "comet-make-kit:serve-uswds-assets",
    configureServer(server) {
      server.middlewares.use(urlPrefix, (req, res, next) => {
        if (!req.url) return next();
        const cleanUrl = req.url.split("?")[0] ?? "";
        const filePath = path.join(uswdsRoot, cleanUrl);
        if (!filePath.startsWith(uswdsRoot)) return next();
        try {
          const stat = fs.statSync(filePath);
          if (!stat.isFile()) return next();
        } catch {
          return next();
        }
        const ext = path.extname(filePath).toLowerCase();
        res.setHeader(
          "Content-Type",
          DEFAULT_MIME[ext] ?? "application/octet-stream",
        );
        res.setHeader("Cache-Control", cacheControl);
        fs.createReadStream(filePath).pipe(res);
      });
    },
  };
}
