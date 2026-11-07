import { ApplicationSection } from "@/components/ApplicationSection";
import { Baseline } from "@/components/Baseline";
import { Concierge } from "@/components/Concierge";
import { Cover } from "@/components/Cover";
import { DemoDoor } from "@/components/DemoDoor";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Immersions } from "@/components/Immersions";
import { Method } from "@/components/Method";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { TheRoom } from "@/components/TheRoom";
import { WaitlistBand } from "@/components/WaitlistBand";
import { WhoFor } from "@/components/WhoFor";

/** Re-render hourly so the open/closed state cannot sit stale in a static page. */
export const revalidate = 3600;

export default function Home() {
  // The waitlist is the way in. The questionnaire still lives at #apply for
  // anyone sent straight to it, but no button on the page opens with it.
  const ctaHref = "#waitlist";
  const ctaLabel = "Join the waitlist";
  const navLabel = "The Waitlist";

  return (
    <>
      <Nav ctaHref={ctaHref} ctaLabel={navLabel} />
      <main>
        <Cover />
        <Hero ctaHref={ctaHref} ctaLabel={ctaLabel} />
        <Problem />
        <Baseline />
        <Method />
        <DemoDoor />
        <Concierge />
        <Immersions />
        <TheRoom />
        <WhoFor />
        <ApplicationSection />
        <WaitlistBand />
      </main>
      <Footer />
    </>
  );
}
