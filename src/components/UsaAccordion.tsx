import { useId, useState, type ReactNode } from "react";
import { MinusSvg, PlusSvg } from "./icons.js";

export interface UsaAccordionItem {
  /** Stable id used for the panel; if omitted, one is generated. */
  id?: string;
  /** Heading content rendered inside the disclosure button. */
  heading: ReactNode;
  /** Panel content rendered inside `.usa-accordion__content`. */
  content: ReactNode;
  /** Initial expanded state for this item. Defaults to `false`. */
  defaultExpanded?: boolean;
}

export interface UsaAccordionProps {
  /** The items to render in order. */
  items: UsaAccordionItem[];
  /** Heading level for each item's `usa-accordion__heading`. Defaults to `h3`. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  /** If true, more than one panel may be open at once. Defaults to `true`. */
  multiselectable?: boolean;
  /** Optional className applied to the wrapping `.usa-accordion` element. */
  className?: string;
}

/**
 * Raw USWDS accordion with React-controlled `aria-expanded` and inline-SVG
 * +/- chevrons. Substitute for `<Accordion />` / `<AccordionItem />` from
 * `@metrostar/comet-uswds` — comet's USWDS runtime that wires `aria-expanded`
 * after mount doesn't always attach in Figma Make's preview, so the chevron
 * sprite never renders.
 *
 * `style={{ backgroundImage: "none" }}` is applied to each button to suppress
 * the simpler-uswds.css background-image sprite (the inline SVG handles the
 * chevron rendering instead).
 */
export function UsaAccordion({
  items,
  headingLevel = 3,
  multiselectable = true,
  className,
}: UsaAccordionProps) {
  const reactId = useId();
  const [openState, setOpenState] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    items.forEach((item, idx) => {
      const key = item.id ?? `item-${idx}`;
      initial[key] = item.defaultExpanded ?? false;
    });
    return initial;
  });

  const HeadingTag = `h${headingLevel}` as "h2" | "h3" | "h4" | "h5" | "h6";

  const wrapperClass = ["usa-accordion", className].filter(Boolean).join(" ");

  return (
    <div
      className={wrapperClass}
      aria-multiselectable={multiselectable ? "true" : undefined}
    >
      {items.map((item, idx) => {
        const key = item.id ?? `item-${idx}`;
        const panelId = `${reactId}-${key}`;
        const isOpen = openState[key] ?? false;
        return (
          <div key={key}>
            <HeadingTag className="usa-accordion__heading">
              <button
                type="button"
                className="usa-accordion__button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setOpenState((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                style={{
                  backgroundImage: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <span>{item.heading}</span>
                {isOpen ? <MinusSvg /> : <PlusSvg />}
              </button>
            </HeadingTag>
            <div
              id={panelId}
              className="usa-accordion__content usa-prose"
              hidden={!isOpen}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
