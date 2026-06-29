import { Alert, Button } from "@metrostar/comet-uswds";
import { UsaAccordion, UsaBanner, UsaFooter } from "@nava/make-kit-comet";
import "./styles/index.css";

/**
 * GDS Make Kit demo app — Comet edition (Simpler theme).
 *
 * Demonstrates the runtime:
 *   - <UsaBanner />        — raw USWDS gov banner with inline SVGs
 *   - comet <Alert>        — works natively in Make
 *   - comet <Button>       — works natively in Make
 *   - <UsaAccordion />     — raw USWDS accordion with inline +/- chevrons
 *   - <UsaFooter />        — minimal USWDS slim footer
 *
 * Replace with your real prototype content. Keep <UsaBanner /> and
 * <UsaAccordion /> as-is unless you have confirmed Make's sandbox has
 * loosened its asset-blocking behavior — see the package README.
 */
export default function App() {
  return (
    <>
      <UsaBanner />

      <header className="usa-header usa-header--basic">
        <div className="usa-nav-container">
          <div className="usa-navbar">
            <div className="usa-logo">
              <em className="usa-logo__text">
                <a href="/" title="Home">
                  GDS Make Kit — Comet edition
                </a>
              </em>
            </div>
          </div>
        </div>
      </header>

      <main className="usa-section" id="main-content">
        <div className="grid-container">
          <h1 className="font-heading-2xl margin-top-0">
            Comet + Simpler theme smoke test
          </h1>

          <p className="usa-intro">
            Demonstrates comet&apos;s Alert and Button components themed with
            the Simpler Grants USWDS theme. Banner and accordion use the
            raw-USWDS wrappers from <code>@nava/make-kit-comet</code>.
          </p>

          <h2>Alert (comet)</h2>
          <Alert id="alert-demo" type="info">
            This alert is rendered by <code>@metrostar/comet-uswds</code> and
            styled by the Simpler theme.
          </Alert>

          <h2 className="margin-top-4">Buttons (comet)</h2>
          <div className="display-flex flex-wrap" style={{ gap: "0.5rem" }}>
            <Button id="btn-default" type="button">
              Default
            </Button>
            <Button id="btn-secondary" type="button" variant="secondary">
              Secondary
            </Button>
            <Button id="btn-outline" type="button" variant="outline">
              Outline
            </Button>
          </div>

          <h2 className="margin-top-4">Accordion (raw USWDS wrapper)</h2>
          <UsaAccordion
            items={[
              {
                id: "a",
                heading: "First accordion item",
                content: (
                  <p>
                    This panel starts expanded. Click the heading to collapse
                    it.
                  </p>
                ),
                defaultExpanded: true,
              },
              {
                id: "b",
                heading: "Second accordion item",
                content: (
                  <p>Inline-SVG chevrons avoid URL-serving issues entirely.</p>
                ),
              },
              {
                id: "c",
                heading: "Third accordion item",
                content: (
                  <p>
                    In a normal Vite app, the simpler-uswds.css background-image
                    sprite renders the chevron. This wrapper is for Make&apos;s
                    preview only.
                  </p>
                ),
              },
            ]}
          />
        </div>
      </main>

      <UsaFooter />
    </>
  );
}
