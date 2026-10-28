import { ApplicationSection } from "@/components/ApplicationSection";
import { Baseline } from "@/components/Baseline";
import { Concierge } from "@/components/Concierge";
import { Cover } from "@/components/Cover";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Method } from "@/components/Method";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { TheRoom } from "@/components/TheRoom";
import { WaitlistBand } from "@/components/WaitlistBand";
import { WhoFor } from "@/components/WhoFor";
import { isCohortOpen } from "@/lib/config";

/** Re-render hourly so the open/closed state cannot sit stale in a static page. */
export const revalidate = 3600;

export default function Home() {
  const open = isCohortOpen();
  const ctaHref = open ? "#apply" : "#waitlist";
  const navLabel = open ? "The Questionnaire" : "The Waitlist";

  return (
    <>
      <Nav ctaHref={ctaHref} ctaLabel={navLabel} />
      <main>
        <Cover />
        <Hero
          ctaHref={ctaHref}
          ctaLabel={open ? "Start the questionnaire" : "Join the waitlist"}
        />
        <Problem />
        <Baseline />
        <Method />
        <TheRoom />
        <Concierge />
        <WhoFor />
        <ApplicationSection />
        <WaitlistBand />
      </main>
      <Footer />
    </>
  );
}
