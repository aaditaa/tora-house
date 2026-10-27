import { Lockup } from "@/components/Brand";

/**
 * The first screen: the mark, the name, the line, and nothing else. The nav stays
 * hidden behind it and fades in once the page has been scrolled past this.
 */
export function Cover() {
  return (
    <section
      id="cover"
      className="flex min-h-[100svh] flex-col items-center justify-center px-[var(--gutter)] py-24"
    >
      <Lockup variant="stacked" withTagline align="center" size="lg" />

      <a
        href="#top"
        className="link-quiet mt-24 flex flex-col items-center gap-3"
        aria-label="Continue to the page"
      >
        <span className="t-eyebrow">Begin</span>
        <svg
          viewBox="0 0 16 28"
          aria-hidden="true"
          className="h-7 w-4 text-fg-muted"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
        >
          <path d="M8 0v24" />
          <path d="M2 18l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}
