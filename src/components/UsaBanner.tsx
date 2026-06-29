import { useId, useState } from "react";
import { DotGovSvg, FlagSvg, HttpsSvg } from "./icons.js";

/**
 * Raw USWDS gov banner with React-controlled aria-expanded and inline-SVG
 * icons. Substitute for `<Banner type="gov" />` from `@metrostar/comet-uswds`,
 * which fails inside Figma Make's preview sandbox because its `.png` flag
 * import resolves to a blocked URL.
 *
 * Behavior, class names, and copy match comet's <Banner /> output exactly,
 * so generated code that uses this wrapper ports cleanly to comet later
 * (replace the import, keep the JSX).
 */
export interface UsaBannerProps {
  /** Optional explicit id for the disclosure region; auto-generated if omitted. */
  id?: string;
}

export function UsaBanner({ id }: UsaBannerProps = {}) {
  const reactId = useId();
  const regionId = id ?? `gov-banner-${reactId}`;
  const [expanded, setExpanded] = useState(false);

  return (
    <section
      className="usa-banner"
      aria-label="Official website of the United States government"
    >
      <div className="usa-accordion">
        <header className="usa-banner__header">
          <div className="usa-banner__inner">
            <div className="grid-col-auto">
              <FlagSvg className="usa-banner__header-flag" />
            </div>
            <div className="grid-col-fill tablet:grid-col-auto">
              <p className="usa-banner__header-text">
                An official website of the United States government
              </p>
              <p className="usa-banner__header-action" aria-hidden="true">
                Here&apos;s how you know
              </p>
            </div>
            <button
              type="button"
              className="usa-accordion__button usa-banner__button"
              aria-expanded={expanded}
              aria-controls={regionId}
              onClick={() => setExpanded((v) => !v)}
              style={{ backgroundImage: "none" }}
            >
              <span className="usa-banner__button-text">
                Here&apos;s how you know
              </span>
            </button>
          </div>
        </header>
        <div
          className="usa-banner__content usa-accordion__content"
          id={regionId}
          hidden={!expanded}
        >
          <div className="grid-row grid-gap-lg">
            <div className="usa-banner__guidance tablet:grid-col-6">
              <DotGovSvg className="usa-banner__icon usa-media-block__img" />
              <div className="usa-media-block__body">
                <p>
                  <strong>Official websites use .gov</strong>
                  <br />A <strong>.gov</strong> website belongs to an official
                  government organization in the United States.
                </p>
              </div>
            </div>
            <div className="usa-banner__guidance tablet:grid-col-6">
              <HttpsSvg className="usa-banner__icon usa-media-block__img" />
              <div className="usa-media-block__body">
                <p>
                  <strong>Secure .gov websites use HTTPS</strong>
                  <br />A <strong>lock</strong> or <strong>https://</strong>{" "}
                  means you&apos;ve safely connected to the .gov website. Share
                  sensitive information only on official, secure websites.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
