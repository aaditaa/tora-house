import { Lockup } from "@/components/Brand";
import { CoverFilm } from "@/components/CoverFilm";
import { Figure } from "@/components/Figure";

/**
 * The first screen: the mark, the name, the line, and nothing else. The nav stays
 * hidden behind it and fades in once the page has been scrolled past this.
 *
 * The wall is a ground rather than a picture, so it carries no alt text. The film
 * lies over it and fades in when it can play, so the photograph is the fallback. The lotus
 * sits about three quarters down the frame, which is why the lockup holds the centre
 * and the scroll cue is pinned to the bottom — all three want the middle otherwise.
 * The scrim is there because the stone ledge low in the frame is light enough that
 * bone type over it would fall to 3.4:1 unaided.
 */
export function Cover() {
  return (
    <section
      id="cover"
      className="on-dark relative flex min-h-[100svh] items-center justify-center overflow-hidden px-[var(--gutter)] py-24"
      style={{ ["--accent-type" as string]: "var(--sand)" }}
    >
      <Figure
        slug="cover"
        fill
        priority
        sizes="100vw"
        className="absolute inset-0"
      />
      <CoverFilm />

      {/* Heavier under the lockup than it was over the still: a moving picture is
          decided by its worst frame, not its average one. */}
      <div aria-hidden="true" className="cover-scrim absolute inset-0" />

      <div className="relative -translate-y-[12svh]">
        <Lockup variant="stacked" withTagline align="center" size="lg" />
      </div>

      <a
        href="#top"
        className="link-quiet absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-fg"
        aria-label="Begin — continue to the page"
      >
        <span className="t-eyebrow text-fg">Begin</span>
        <svg
          viewBox="0 0 16 28"
          aria-hidden="true"
          className="h-7 w-4"
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
