import type { ReactNode } from "react";

export interface UsaFooterLink {
  label: ReactNode;
  href: string;
}

export interface UsaFooterProps {
  /**
   * Primary footer navigation links. Defaults to a small About/Help/Contact
   * placeholder set; pass your own array to override.
   */
  links?: UsaFooterLink[];
  /**
   * Heading rendered in the footer's secondary section. Defaults to
   * "GDS Make Kit — Comet edition" — set to your project name in real apps.
   */
  heading?: ReactNode;
  /** Aria label applied to the nav element. */
  navAriaLabel?: string;
  /** Optional className applied to the root `<footer>`. */
  className?: string;
}

const DEFAULT_LINKS: UsaFooterLink[] = [
  { label: "About", href: "#about" },
  { label: "Help", href: "#help" },
  { label: "Contact", href: "#contact" },
];

/**
 * Minimal USWDS slim-style footer for shells that need a quick chrome
 * placeholder. Real Simpler Grants projects should hand-roll the branded
 * footer + GrantsIdentifier (see `composition/footer.md` in the source kit
 * guidelines); this component exists primarily to round out demo apps and
 * the kit's smoke-test page.
 */
export function UsaFooter({
  links = DEFAULT_LINKS,
  heading = "GDS Make Kit — Comet edition",
  navAriaLabel = "Footer navigation",
  className,
}: UsaFooterProps = {}) {
  const footerClass = ["usa-footer", "usa-footer--slim", className]
    .filter(Boolean)
    .join(" ");

  return (
    <footer className={footerClass}>
      <div className="usa-footer__primary-section">
        <div className="usa-footer__primary-container grid-row">
          <div className="mobile-lg:grid-col-8">
            <nav className="usa-footer__nav" aria-label={navAriaLabel}>
              <ul className="grid-row grid-gap">
                {links.map((link, idx) => (
                  <li
                    key={`${link.href}-${idx}`}
                    className="mobile-lg:grid-col-4 desktop:grid-col-auto usa-footer__primary-content"
                  >
                    <a className="usa-footer__primary-link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="usa-footer__secondary-section">
        <div className="grid-container">
          <div className="usa-footer__logo grid-row grid-gap-2">
            <div className="grid-col-auto">
              <p className="usa-footer__logo-heading">{heading}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
