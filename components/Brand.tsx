import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";

/**
 * The torana: two stambha, two architraves with upturned tips, a lotus finial —
 * and the threshold left open. Drawn in currentColor so it reverses onto any
 * ground without a second asset.
 *
 * Brand rules honoured here: below 32px the lower architrave is dropped
 * (`compact`), and the gateway is never closed.
 */
export function ToranaMark({
  className = "",
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="presentation"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M50 13c3.4 5.4 3.4 9.6 0 14-3.4-4.4-3.4-8.6 0-14Z"
        fill="currentColor"
      />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M50 27v7" />
        <path d="M17 27q0 7 7 7h52q7 0 7-7" />
        {compact ? null : <path d="M21 43q0 6.5 6.5 6.5h45q6.5 0 6.5-6.5" />}
        <path d="M33.5 34v52" />
        <path d="M66.5 34v52" />
        <path d="M23 86h54" />
      </g>
    </svg>
  );
}

/**
 * The lockups from the brand sheet.
 *   inline   — mark, hairline, wordmark. The nav.
 *   stacked  — mark over wordmark, brass rule, tagline. The footer.
 *   wordmark — type alone, brass rule beneath.
 */
export function Lockup({
  variant = "inline",
  className = "",
  withTagline = false,
  align = "start",
  size = "md",
}: {
  variant?: "inline" | "stacked" | "wordmark";
  className?: string;
  withTagline?: boolean;
  align?: "start" | "center";
  /** "lg" is the cover screen, where the lockup is the only thing on the page. */
  size?: "md" | "lg";
}) {
  const cross =
    align === "center" ? "items-center text-center" : "items-start text-left";
  const large = size === "lg";

  if (variant === "stacked") {
    return (
      <span
        className={`flex flex-col ${large ? "gap-7" : "gap-4"} ${cross} ${className}`}
      >
        <ToranaMark
          className={`${large ? "h-24 w-24" : "h-14 w-14"} text-fg`}
        />
        <span
          className={`t-wordmark ${large ? "text-4xl md:text-5xl" : "text-2xl"} text-fg`}
        >
          {BRAND_NAME}
        </span>
        <span
          aria-hidden="true"
          className={`block h-px ${large ? "w-16" : "w-10"} bg-brass`}
        />
        {withTagline ? (
          <span className="t-eyebrow" style={{ color: "var(--brass)" }}>
            {BRAND_TAGLINE}
          </span>
        ) : null}
      </span>
    );
  }

  if (variant === "wordmark") {
    return (
      <span className={`flex flex-col gap-3 ${cross} ${className}`}>
        <span className="t-wordmark text-xl text-fg">{BRAND_NAME}</span>
        <span aria-hidden="true" className="block h-px w-10 bg-brass" />
      </span>
    );
  }

  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <ToranaMark className="h-8 w-8 shrink-0 text-fg" />
      <span aria-hidden="true" className="h-7 w-px bg-rule" />
      <span className="flex flex-col">
        <span className="t-wordmark text-[0.9375rem] text-fg">
          {BRAND_NAME}
        </span>
        {withTagline ? (
          <span className="t-eyebrow text-[0.5625rem]">{BRAND_TAGLINE}</span>
        ) : null}
      </span>
    </span>
  );
}
