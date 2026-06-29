# @nava/make-kit-comet

> Runtime for the GDS Make Kit (Comet edition). Make-sandbox Vite shim, raw USWDS wrappers, and the Simpler Grants theme bundled as the default. Theme-agnostic: future programs ship CSS-only sibling packages.

Built for [Figma Make](https://www.figma.com/make/) projects (and any other Vite + React project) on top of [`@metrostar/comet-uswds`](https://www.npmjs.com/package/@metrostar/comet-uswds) + [`@uswds/uswds`](https://www.npmjs.com/package/@uswds/uswds).

## What's in the box

- **`cometMakeKit()` Vite plugin** — three Make-sandbox workarounds bundled as one plugin: USWDS asset middleware, image-import rewrite, esbuild rewrite for pre-bundled deps.
- **Raw-USWDS React wrappers** — `<UsaBanner />`, `<UsaAccordion />`, `<UsaFooter />` plus the inline-SVG icons they rely on. These substitute for comet's `<Banner />` and `<Accordion />` inside Figma Make's preview, where comet's bundled assets can't reliably be reached.
- **Simpler Grants theme bundle** — the precompiled USWDS + Simpler theme CSS, shipped as the default `./styles` export (minified) plus a `./styles/dev` opt-in for readable debugging. Mirrors USWDS's own `uswds.css` / `uswds.min.css` convention.
- **Templates** — drop-in `vite.config.ts`, `App.tsx`, `main.tsx`, `index.html`, `src-styles-index.css` for spinning up a fresh project.

## Install

This package is currently distributed via tagged GitHub releases (not yet published to npmjs.com). Add it as a github-tag dependency:

```bash
npm install github:slowbot/make-kit-comet#v0.1.0 @uswds/uswds @metrostar/comet-uswds
```

Or pin in `package.json`:

```json
{
  "dependencies": {
    "@nava/make-kit-comet": "github:slowbot/make-kit-comet#v0.1.0",
    "@uswds/uswds": "^3.13.0",
    "@metrostar/comet-uswds": "^3.9.0"
  }
}
```

The package's `prepare` script runs `tsup` + `lightningcss` at install time, so the consumer's `node_modules/@nava/make-kit-comet/dist/` and `node_modules/@nava/make-kit-comet/styles/simpler/simpler-uswds.min.css` are generated on first install. After that, imports work identically to a published npm package.

## Use

```ts
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cometMakeKit } from "@nava/make-kit-comet/vite";

export default defineConfig({
  plugins: [react(), cometMakeKit()],
});
```

```css
/* src/styles/index.css */
@import "@nava/make-kit-comet/styles";
```

```tsx
// anywhere
import { UsaBanner, UsaAccordion, UsaFooter } from "@nava/make-kit-comet";
import { Alert, Button } from "@metrostar/comet-uswds";

export default function App() {
  return (
    <>
      <UsaBanner />
      <main>
        <Alert id="info" type="info">Hello from comet.</Alert>
        <Button id="save" type="button">Save</Button>
        <UsaAccordion
          items={[
            { id: "a", heading: "First", content: <p>Body A</p>, defaultExpanded: true },
            { id: "b", heading: "Second", content: <p>Body B</p> },
          ]}
        />
      </main>
      <UsaFooter />
    </>
  );
}
```

## Style entry points

| Import path | What it loads |
|---|---|
| `@nava/make-kit-comet/styles` | Default = Simpler theme, minified |
| `@nava/make-kit-comet/styles/dev` | Default theme, **unminified** for DevTools / grep |
| `@nava/make-kit-comet/styles/simpler` | Simpler theme explicitly, minified |
| `@nava/make-kit-comet/styles/simpler/dev` | Simpler theme explicitly, unminified |

To use a different theme later, install a sibling theme package and change one line:

```css
/* swap from Simpler default to another program's theme */
@import "@nava/make-kit-comet-theme-<program>/styles";
```

See [THEMES.md](./THEMES.md) for the sibling-theme-package contract.

## Smoke checklist

After install + `npm run dev`, you should see:

- Federal gov banner with the US flag rendered as an inline SVG. Click "Here's how you know" to expand.
- comet `<Alert>` with the info icon (cyan panel).
- comet `<Button>` row in **mint** with a 5px bottom bar (NOT USWDS blue).
- Accordion with `+/-` chevrons that toggle correctly.
- Body text in Public Sans (not Helvetica / system-ui).
- Browser console **clean** — no 404s on `/uswds/*`.

If buttons are USWDS blue, you're loading vanilla USWDS on top of Simpler. Check `src/styles/index.css` for a stray `@import "@uswds/uswds/dist/css/uswds.min.css"` and remove it.

If the gov banner flag is missing or accordion chevrons don't render, you've replaced `<UsaBanner />` / `<UsaAccordion />` with comet's `<Banner />` / `<Accordion />`. Restore the wrappers. The full reasoning is in the source kit's [`MAKE-SANDBOX-WORKAROUNDS.md`](https://github.com/slowbot/sandbox/blob/main/design-library-experiment/make-kit-comet/MAKE-SANDBOX-WORKAROUNDS.md) (link assumes the sandbox itself gets pushed to GitHub under the same handle; until then, reference the local file).

## Figma Make installer skill

A companion `/install-simpler-runtime` Figma Make skill exists that pulls this package into a fresh Make project in one slash command. See the source kit's `skills/README.md` for upload/publish instructions.

## Manual install (non-Make Vite projects)

See [INSTALL.md](./INSTALL.md).

## Theme contract for sibling packages

See [THEMES.md](./THEMES.md).

## License

UNLICENSED for now — license decision pending project sponsor. Treat this package as internal/experimental until that's resolved.

Note: even though the source is publicly visible on GitHub (so the github-install path and jsDelivr-GH CDN can reach it), UNLICENSED means there is no granted right to use the code. If you're outside the originating organization and want to use this in a real project, ask before doing so.
