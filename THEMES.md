# Theme contract for `@slowbot/make-kit-comet`

This package ships the **Simpler Grants theme** as the bundled default. Future programs can ship their own theme as a **CSS-only sibling package** without re-implementing the Make-sandbox shim, the raw-USWDS wrappers, or any of the other runtime infrastructure here.

This file documents the contract a sibling theme package must satisfy.

## Architecture

```
@metrostar/comet-uswds          ← upstream React + USWDS (peer dep)
        ↑
@slowbot/make-kit-comet            ← this package
                                  • cometMakeKit() Vite plugin
                                  • UsaBanner / UsaAccordion / UsaFooter / icons
                                  • Bundled default theme: Simpler
        ↑                        ↑                            ↑
(uses Simpler default)   @slowbot/make-kit-comet-theme-<prog2>   @slowbot/make-kit-comet-theme-<prog3>
                                  CSS-only sibling packages
```

## Naming convention

```
@slowbot/make-kit-comet-theme-<program-slug>
```

Examples:
- `@slowbot/make-kit-comet-theme-medicare`
- `@slowbot/make-kit-comet-theme-va-benefits`
- `@slowbot/make-kit-comet-theme-cms-marketplace`

Use a stable, lowercase, hyphenated `<program-slug>`. Don't change it after the first publish — downstream consumers' `package.json` and `index.css` will reference it.

## Required exports

Every theme package MUST export these paths from its `package.json` `exports` field:

| Export path | What it must point at |
|---|---|
| `./styles` | Default convenience entry. Loads the minified theme bundle + any font overrides. |
| `./styles/dev` | Same content as `./styles` but unminified. Used for DevTools debugging and grep investigations. |
| `./styles/<program-slug>` | Same as `./styles`. Explicit by-theme-name path. |
| `./styles/<program-slug>/dev` | Same as `./styles/dev`. Explicit by-theme-name path. |
| `./styles/<program-slug>/<program-slug>-uswds.css` | The raw source-form bundle (unminified). |
| `./styles/<program-slug>/<program-slug>-uswds.min.css` | The minified bundle. |
| `./styles/<program-slug>/fonts.css` | Font-family overrides (if the theme uses non-default fonts). Omit if the theme uses USWDS defaults. |

Mirror the layout this package uses for the `simpler/` directory — same filename convention, just substitute the program slug.

## Required peer dependency

```json
{
  "peerDependencies": {
    "@slowbot/make-kit-comet": "^1"
  }
}
```

Theme packages depend on this package for the React wrappers and Vite plugin. They MUST NOT redistribute those — bug fixes happen here, theme packages just provide CSS.

## What a theme package MUST NOT export

- React components — always come from `@slowbot/make-kit-comet`.
- A Vite plugin — always comes from `@slowbot/make-kit-comet/vite`.
- A `<theme>` JS API of any kind. The contract is CSS-only. If a theme needs JS-level overrides, surface them as new optional props on the wrappers in this package (so all themes benefit).

## Build pipeline

The theme bundle is the precompiled output of:

1. Your program's `_uswds-theme.scss` (USWDS settings — colors, type scale, button radius, etc.)
2. Your program's `_uswds-theme-custom-styles.scss` (component overrides on top of USWDS).
3. The full USWDS source.

…compiled to a single browser-ready CSS file. The build chain currently used for the Simpler theme bundle lives in [`design-library-experiment/make-kit-comet/scripts/build-comet-kit-css.sh`](https://github.com/slowbot/sandbox/blob/main/design-library-experiment/make-kit-comet/scripts/build-comet-kit-css.sh) in the source kit (link assumes the sandbox itself gets pushed to GitHub under the same handle; until then, reference the local file). You can adapt that script for your program by pointing it at your theme SCSS.

The minified `*.min.css` is the same content run through `lightningcss-cli --minify`. See this package's `prebuild` script for the exact invocation.

## Consumer swap (one line)

A consumer that installed both packages swaps the theme by changing one `@import` in `src/styles/index.css`:

```css
/* default — Simpler */
@import "@slowbot/make-kit-comet/styles";

/* swap to another program */
@import "@slowbot/make-kit-comet-theme-<program>/styles";
```

No Vite config change. No JS code change. The wrappers and the Vite plugin keep working identically — they're theme-agnostic.

## Per-theme Figma Make skill

Each theme should ship its own `/install-<program>-runtime` Figma Make skill, copied from this package's `install-simpler-runtime.md`. Swap:
- The package name in the npm install step.
- The fetched `src-styles-index.css` content (so the swap line points at your theme).

Everything else is identical. See the source kit's `skills/README.md` for the upload + publish flow.

## Versioning

Theme packages version independently from `@slowbot/make-kit-comet`. Both follow semver. Coordinate major-version bumps:

- A `@slowbot/make-kit-comet@2.0.0` that changes the wrapper API (e.g., renames a prop) likely requires no theme-package change (themes are CSS-only).
- A theme bundle rebuild from new USWDS source (e.g., USWDS 4) lives in the theme package's own major bump.

## Reference implementation

The Simpler theme bundled inside this package IS the reference implementation. To author a new theme package, scaffold a repo with:

```
@slowbot/make-kit-comet-theme-<program>/
├── package.json                 (peer-dep on @slowbot/make-kit-comet, files: ["styles"])
├── README.md
└── styles/
    ├── index.css
    ├── dev.css
    └── <program>/
        ├── index.css
        ├── dev.css
        ├── <program>-uswds.css        (source-of-truth, committed)
        ├── <program>-uswds.min.css    (generated at prebuild, gitignored, shipped in tarball)
        └── fonts.css                  (optional)
```

…with the same `prebuild` minify step in `package.json` that this package uses.
