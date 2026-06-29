/**
 * Inline SVG icons used by the raw-USWDS wrappers in this package.
 *
 * All SVG geometry is copied 1:1 from @uswds/uswds@3.13.0/dist/img/*.svg so
 * the visual matches the canonical USWDS rendering. The inline approach
 * exists because Figma Make's preview sandbox selectively blocks asset
 * URL requests — see ../../MAKE-SANDBOX-WORKAROUNDS.md in the source kit.
 */

export interface SvgProps {
  className?: string;
}

export function FlagSvg({ className }: SvgProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 44"
      width="16"
      height="11"
      aria-hidden="true"
    >
      <path fill="#fff" d="M0 0h64v44H0z" />
      <path
        fill="#da3e1f"
        d="M0 0h64v4H0zm0 40h64v4H0zm0-8h64v4H0zm0-8h64v4H0zm0-8h64v4H0zm0-8h64v4H0z"
      />
      <path fill="#1e33b1" d="M0 0h32v28H0z" />
      <path
        fill="#fff"
        d="M8 12h4v4H8zm16 0h4v4h-4zm-8 0h4v4h-4zm4-8h4v4h-4zm-8 0h4v4h-4zM4 20h4v4H4zm16 0h4v4h-4zm-8 0h4v4h-4zM4 4h4v4H4z"
      />
    </svg>
  );
}

export function DotGovSvg({ className }: SvgProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      <path
        fill="#2378C3"
        fillRule="evenodd"
        d="m32 0c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32zm0 1.2c-17 0-30.8 13.8-30.8 30.8s13.8 30.8 30.8 30.8 30.8-13.8 30.8-30.8-13.8-30.8-30.8-30.8zm11.4 38.9c.5 0 .9.4.9.8v1.6h-24.6v-1.6c0-.5.4-.8.9-.8zm-17.1-12.3v9.8h1.6v-9.8h3.3v9.8h1.6v-9.8h3.3v9.8h1.6v-9.8h3.3v9.8h.8c.5 0 .9.4.9.8v.8h-21.4v-.8c0-.5.4-.8.9-.8h.8v-9.8zm5.7-8.2 12.3 4.9v1.6h-1.6c0 .5-.4.8-.9.8h-19.6c-.5 0-.9-.4-.9-.8h-1.6v-1.6s12.3-4.9 12.3-4.9z"
      />
    </svg>
  );
}

export function HttpsSvg({ className }: SvgProps) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
    >
      <path
        fill="#719F2A"
        fillRule="evenodd"
        d="M32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0zm0 1.208C14.994 1.208 1.208 14.994 1.208 32S14.994 62.792 32 62.792 62.792 49.006 62.792 32 49.006 1.208 32 1.208zm0 18.886a7.245 7.245 0 0 1 7.245 7.245v3.103h.52c.86 0 1.557.698 1.557 1.558v9.322c0 .86-.697 1.558-1.557 1.558h-15.53c-.86 0-1.557-.697-1.557-1.558V32c0-.86.697-1.558 1.557-1.558h.52V27.34A7.245 7.245 0 0 1 32 20.094zm0 3.103a4.142 4.142 0 0 0-4.142 4.142v3.103h8.284V27.34A4.142 4.142 0 0 0 32 23.197z"
      />
    </svg>
  );
}

export function PlusSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flex: "0 0 auto" }}
    >
      <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

export function MinusSvg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      aria-hidden="true"
      style={{ flex: "0 0 auto" }}
    >
      <path fill="currentColor" d="M19 13H5v-2h14v2z" />
    </svg>
  );
}
