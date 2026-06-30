# Next bump — @slowbot/make-kit-comet

Open issues collected since `0.2.0` (published 2026-06-29). When this list
crosses ~3 items or a blocker shows up, cut `0.3.0`.

## Why we batch

- Every npm publish hits pnpm's `minimumReleaseAge` window in Figma Make's
  Kit installer (~3 days). Mid-publish, Kit installs of the new version
  fail with `ERR_PNPM_NO_MATCHING_VERSION` or release-age complaints.
- Every npm bump also requires bumping the Kit's pinned version in
  `design-library-experiment/make-kit-comet/package.json` (currently pins
  `0.2.0` exactly, no caret) and republishing the Kit.
- So: one publish = one Kit republish = one ~3-day stall. Batch
  aggressively.

## Pending — target 0.3.0

### Sandbox asset serving — confirmed broken, fix path identified

- [x] **Switch USWDS image imports from URL-redirect to inline data URIs.** *(landed 2026-06-30, awaiting publish)*
  - Affects: comet `<Icon>` (renders label-only, no glyph),
    `<Search>` button icon (404), comet `<Accordion>` expand/collapse
    chevrons (missing), comet `<Banner>` flag (broken — though `UsaBanner`
    wrapper bypasses this), HTTPS lock + dot-gov icons.
  - Diagnostic confirmed 2026-06-30:
    - Vite middleware works correctly when curled on its local port
      (1381 → `/uswds/img/sprite.svg` returns 200 + real SVG content).
    - Foundry's preview proxy (port 1382, what the browser hits via
      `makeproxy-c.figma.site`) **does NOT forward `/uswds/*` to Vite**.
      Returns SPA fallback HTML (`200 text/html`) for the sprite path,
      and `403 Forbidden` for individual `/uswds/img/usa-icons/*.svg`
      files. Public/ folder also returns SPA fallback. No URL-based
      asset strategy works in the Make sandbox.
  - Fix: change `redirect-image-imports.ts` and
    `redirect-image-imports-esbuild.ts` to read the SVG file from disk
    during the load hook and emit a **base64 data URI** export instead
    of a URL string. comet's `import sprite from "@uswds/uswds/img/sprite.svg"`
    then resolves to `"data:image/svg+xml;base64,..."` and the browser
    never fetches anything.
  - Trade-off: bundle grows by ~75KB (sprite + flag.png + lock + dot-gov
    + a few other comet-imported icons). Acceptable for Make-sandbox
    prototype use case.
  - Works in stock Vite too (no regression for non-Figma-Make consumers).
  - Files to change in `make-kit-comet/src/vite/`:
    1. `redirect-image-imports.ts` — load() hook reads file, emits data URI.
    2. `redirect-image-imports-esbuild.ts` — same for optimizeDeps path.
    3. `serve-uswds-assets.ts` — DEPRECATE but keep for non-Make
       consumers that prefer URL-based serving (gate via option).
  - Captured: 2026-06-30, Kit preview smoke test.

### CSS — Simpler theme

- [ ] **Default-size solid button: bottom underline band overlaps text padding.**
  - Symptom: default `.usa-button` (e.g. `Save and continue`) text sits flush
    against the darker bottom band; `.usa-button--big` (e.g. `Apply now`)
    and outline variants render correctly.
  - Cause: Simpler theme `padding-bottom` on `.usa-button` doesn't account
    for the underline band width.
  - Fix location: `styles/simpler/simpler-uswds.css` (or upstream
    Simpler theme source if we're vendoring), then re-minify via
    `npm run prebuild`.
  - Reference: Figma node 807-6816 in GDS Grants.gov Design System
    (Custom USWDS Design Kit Beta).
  - Captured: 2026-06-30, Kit preview.

- [ ] **Pagination: current-page button loses contrast.**
  - Symptom: current page indicator (e.g. page 4 in a 12-page paginator)
    renders as a dark/black filled box with dark text — text is unreadable.
  - Cause: Simpler theme overrides `.usa-pagination__button.usa-current`
    background but doesn't invert the text color to white. Stock USWDS
    handles this with `color: white` on the same selector.
  - Fix location: `styles/simpler/simpler-uswds.css` —
    `.usa-pagination__button.usa-current { color: white; }` (or whatever
    Simpler's branded inverse text token is).
  - Captured: 2026-06-30, Kit preview.

- [ ] **ProcessList step indicator colors are stock USWDS blue, not Simpler.**
  - Symptom: numbered step circles render in USWDS primary-vivid blue
    instead of Simpler's navy / mint palette.
  - Cause: Simpler theme doesn't override
    `.usa-process-list__counter` background / border colors.
  - Fix location: `styles/simpler/simpler-uswds.css` — add overrides for
    `.usa-process-list__counter`, `.usa-process-list--current .usa-process-list__counter`,
    and `.usa-process-list__title` to use Simpler tokens.
  - Captured: 2026-06-30, Kit preview.

### JS / wrappers

- (none yet — but if the sprite issue above can't be solved via middleware,
  individual sprite-using components like `<Icon>` may need raw-markup
  wrappers similar to `UsaBanner` / `UsaAccordion`. Defer until the sprite
  diagnostic above is run.)

### Upstream comet — observed but not ours to fix

- **`<TextInput mask="phone_number">` (and possibly `<Select>` with empty
  `defaultOption.value=""`) triggers "controlled → uncontrolled" React
  warning.** Non-fatal yellow console warning. Comet's internal state
  management flips the value between defined and undefined during mount.
  Captured: 2026-06-30. If it ever becomes blocking, file with comet
  upstream or wrap our showcase inputs with explicit `defaultValue=""`.

### Templates (`templates/*`)

- [ ] **`App.tsx` template: `<CardHeader>` wraps an inner `<h3>`** causing
  `validateDOMNesting` warning. Fixed in the Kit's local copy already;
  the template shipped via npm still has it.
  - Fix location: `templates/App.tsx`
  - Change: `<CardHeader><h3 className="usa-card__heading">{x}</h3></CardHeader>`
    → `<CardHeader>{x}</CardHeader>`
  - Captured: 2026-06-30, Kit preview.

### Skill (`install-simpler-runtime`)

- (none yet — skill is at v0.4.0)

## Process when we cut 0.3.0

1. Fix every item above in the npm package source repo
   (`/Users/jessejames/Sites/sandbox/make-kit-comet/`).
2. `npm run prebuild && npm run build && npm run verify`
3. Bump `package.json` version to `0.3.0`.
4. `git commit -am "0.3.0 — <summary>"`, `git tag v0.3.0`, `git push --tags`
5. `npm publish --otp=<2fa>`
6. **Wait ~3 days** for pnpm release-age window to clear in Figma Make.
7. In the Kit (`design-library-experiment/make-kit-comet/`):
   - Update `package.json` pin from `0.2.0` → `0.3.0`
   - In Figma Make Kit editor, `Edit items in kit` → bump
     `@slowbot/make-kit-comet` to `0.3.0`
   - Re-test preview
   - `Update kit` to publish Kit changes
8. Move resolved items here to a "Released in 0.3.0" section, archive
   when 0.4.0 cycle starts.

## Released

### 0.3.0 (pending publish — built 2026-06-30)

- **Vite plugins now inline USWDS images as base64 data URIs by default**
  (`imageMode: "inline"`). Fixes comet `<Icon>`, `<Search>` icon,
  `<Accordion>` chevrons, `<Banner>` US flag, lock/dot-gov icons in
  Figma Make's preview sandbox, where Foundry's proxy blocks
  `/uswds/*` URL-based asset serving.
- `cometMakeKit({ imageMode: "url" })` opt-in for non-Make consumers
  who want smaller bundles and have a working middleware path.
- `serveUswdsAssets()` middleware retained as defense-in-depth (any
  code path that bypasses the import rewrite still resolves).
- New named exports: `createRedirectUswdsImageImportsEsbuild`,
  `RedirectUswdsImageImportsOptions`,
  `RedirectUswdsImageImportsEsbuildOptions`, `UswdsImageMode`.
- `redirectUswdsImageImportsEsbuild` default export preserved for
  backwards compatibility (defaults to `"inline"` mode).

Trade-off: bundle grows ~95KB (sprite is the dominant cost; per-icon
SVGs are <0.5KB each). Acceptable for prototype workflow.

### 0.2.0 (2026-06-29)

Initial published release. Renamed from `@nava/make-kit-comet`. MIT.
