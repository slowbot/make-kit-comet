/**
 * @nava/make-kit-comet — GDS Make Kit (Comet edition) runtime.
 *
 * Theme-agnostic React + Vite runtime for Figma Make projects built on
 * `@metrostar/comet-uswds`. Ships:
 *   - Raw-USWDS wrappers (UsaBanner, UsaAccordion, UsaFooter, icons) that
 *     work inside Figma Make's preview sandbox, where comet's <Banner> and
 *     <Accordion> can't reliably reach their bundled assets.
 *   - The `cometMakeKit()` Vite plugin (see `./vite`) that bridges USWDS
 *     asset URLs into Make's preview without a postinstall copy step.
 *   - A precompiled Simpler Grants theme as the bundled default
 *     (see `./styles`).
 *
 * For other programs, ship a sibling theme package
 * (`@nava/make-kit-comet-theme-<program>`) that satisfies the contract
 * documented in THEMES.md.
 */

export { UsaBanner } from "./components/UsaBanner.js";
export type { UsaBannerProps } from "./components/UsaBanner.js";

export {
  UsaAccordion,
} from "./components/UsaAccordion.js";
export type {
  UsaAccordionProps,
  UsaAccordionItem,
} from "./components/UsaAccordion.js";

export { UsaFooter } from "./components/UsaFooter.js";
export type { UsaFooterProps, UsaFooterLink } from "./components/UsaFooter.js";

export {
  FlagSvg,
  DotGovSvg,
  HttpsSvg,
  PlusSvg,
  MinusSvg,
} from "./components/icons.js";
export type { SvgProps } from "./components/icons.js";
