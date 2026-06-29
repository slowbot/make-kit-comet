# Manual install — non-Figma-Make Vite projects

This document covers installing `@nava/make-kit-comet` into a plain local Vite + React project (or any other Vite-compatible scaffold). If you're working in **Figma Make**, use the `/install-simpler-runtime` skill instead — it does all of this in one slash command.

## Prerequisites

- Node 18+ and npm/pnpm/yarn.
- A Vite + React project. To scaffold one: `npm create vite@latest my-app -- --template react-ts`.

## Step 1 — install packages

This package is currently distributed via tagged GitHub releases (not yet published to npmjs.com):

```bash
npm install github:jessejames/make-kit-comet#v0.1.0 @uswds/uswds @metrostar/comet-uswds
```

The first installs this package directly from a public GitHub tag; the latter two are peer dependencies (Vite resolves them at build time).

`npm` clones the tag, runs the package's `prepare` script (which executes `tsup` + `lightningcss` against the cloned source), and places the built output in your `node_modules/@nava/make-kit-comet/`. First install takes ~20s longer than a normal npm-registry install; subsequent installs use the lockfile-pinned commit SHA and are cached normally.

## Step 2 — wire the Vite plugin

Replace your `vite.config.ts` with the template from this package, or merge `cometMakeKit()` into your existing config:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { cometMakeKit } from "@nava/make-kit-comet/vite";

export default defineConfig({
  plugins: [react(), cometMakeKit()],
});
```

`cometMakeKit()` bundles three Make-sandbox workarounds. They are **load-bearing** even outside Make:
- The USWDS asset middleware serves `/uswds/img/*.svg` and `/uswds/fonts/*.woff2` paths that the Simpler theme CSS references — without it, the bundled `simpler-uswds.css` would 404 on most icons and fonts.
- The image-import rewrite means consumer code can still write `import flag from "@uswds/uswds/img/us_flag_small.png"` without breaking.
- The esbuild rewrite makes comet's pre-bundled `<Banner>` resolve its flag asset correctly.

If you intentionally don't want any of them, pass `cometMakeKit({ disable: ["..."] })` — see [`src/vite/index.ts`](./src/vite/index.ts).

## Step 3 — load the theme CSS

Create `src/styles/index.css`:

```css
@import "@nava/make-kit-comet/styles";
```

Then import it from your app entry (`src/main.tsx`):

```tsx
import "./styles/index.css";
```

That single import loads:
- The precompiled Simpler theme bundle (`simpler-uswds.min.css`, ~800 KB unminified-source).
- The Google Fonts font-family override layer (`fonts.css`).

For DevTools-friendly debugging of the bundled CSS rules, swap to `@nava/make-kit-comet/styles/dev` to load the unminified variant. Then revert before deploying.

## Step 4 — use the components

```tsx
import { Alert, Button } from "@metrostar/comet-uswds";
import { UsaAccordion, UsaBanner, UsaFooter } from "@nava/make-kit-comet";

export default function App() {
  return (
    <>
      <UsaBanner />
      <main className="usa-section">
        <div className="grid-container">
          <h1 className="font-heading-2xl">Hello USWDS</h1>
          <Alert id="info" type="info">Mint info panel.</Alert>
          <Button id="save" type="button">Save</Button>
          <UsaAccordion
            items={[
              { id: "a", heading: "First", content: <p>Body</p>, defaultExpanded: true },
              { id: "b", heading: "Second", content: <p>Body</p> },
            ]}
          />
        </div>
      </main>
      <UsaFooter />
    </>
  );
}
```

## Step 5 — smoke test

`npm run dev` and verify the [smoke checklist in the README](./README.md#smoke-checklist).

## Step 6 (optional) — neutralize Tailwind / shadcn scaffold

If you scaffolded from a template that included Tailwind or shadcn, follow the empty-with-sentinel pattern from the source kit's [`INSTALL.md` Phase 2](https://github.com/jessejames/sandbox/blob/main/design-library-experiment/make-kit-comet/kit-templates/INSTALL.md). Short version:

- Empty (don't delete) `src/styles/tailwind.css`, `src/styles/theme.css`, `src/styles/globals.css`, `postcss.config.mjs`, `tailwind.config.*`, `components.json` — each gets a sentinel comment that says "do not refill".
- Remove `@tailwindcss/vite`, `tailwindcss`, `tw-animate-css`, `tailwind-merge`, `class-variance-authority`, `@radix-ui/*`, `lucide-react`, `cmdk`, `sonner`, `vaul`, `embla-carousel-react`, `framer-motion`, etc. from `package.json`.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Buttons are USWDS blue, not mint | `simpler-uswds.css` not loaded, OR vanilla `@uswds/uswds/dist/css/uswds.min.css` got imported on top. Check `src/styles/index.css`. |
| Gov banner flag is blank | You replaced `<UsaBanner />` with comet's `<Banner />`. Restore `<UsaBanner />` (see the source kit's [MAKE-SANDBOX-WORKAROUNDS.md](https://github.com/jessejames/sandbox/blob/main/design-library-experiment/make-kit-comet/MAKE-SANDBOX-WORKAROUNDS.md) for why). |
| Accordion has no +/− chevrons | Same — you replaced `<UsaAccordion />` with comet's `<Accordion />`. Restore. |
| Body text is Helvetica / Times | `fonts.css` didn't load. Check that you imported `@nava/make-kit-comet/styles` (not just the `simpler-uswds.css` file directly). |
| `Cannot find module '@uswds/uswds/js/usa-accordion'` | `@uswds/uswds` not installed. Run `npm install @uswds/uswds`. |
| `Property 'id' is required` TypeScript error on a comet component | comet requires `id` on every component. Add it. |
| 404 on `/uswds/img/sprite.svg` in the console | `cometMakeKit()` is missing from `vite.config.ts`. Add it back. |

## Future themes

To use a different program's theme instead of Simpler, see [THEMES.md](./THEMES.md) — install the sibling theme package and swap one `@import` line in `src/styles/index.css`.
