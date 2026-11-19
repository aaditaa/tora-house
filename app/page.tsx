import { Announcement } from "@/components/Announcement";
import { ApplicationSection } from "@/components/ApplicationSection";
import { Baseline } from "@/components/Baseline";
import { Concierge } from "@/components/Concierge";
import { Cover } from "@/components/Cover";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Immersions } from "@/components/Immersions";
import { Invitation } from "@/components/Invitation";
import { Method } from "@/components/Method";
import { Nav } from "@/components/Nav";
import { Problem } from "@/components/Problem";
import { TheRoom } from "@/components/TheRoom";
import { WaitlistBand } from "@/components/WaitlistBand";
import { WhoFor } from "@/components/WhoFor";
import {
  anchorOf,
  featuredImmersion,
  formatDay,
  formatInr,
  formatTime,
  immersionLeads,
  ordinalWordOf,
  reserveLabelOf,
} from "@/lib/immersions";
import { seatsLeft } from "@/lib/seats";

/** Re-render hourly so the open/closed state cannot sit stale in a static page. */
export const revalidate = 3600;

export default async function Home() {
  // One "now" for the whole render, so the banner, hero, nav, invitation and
  // section can never disagree about whether the immersion has run.
  const now = new Date();
  const feature = featuredImmersion(now);
  const left = feature && !feature.past ? await seatsLeft(feature.ev) : null;

  // While an immersion is on sale it leads; the day it runs, every one of these
  // falls back to the waitlist on its own, with no edit anywhere. A full room
  // does the same: the section says it is full, and nothing else on the page
  // goes on offering a seat that is not there.
  const upcoming = feature && !feature.past ? feature.ev : null;
  const full = upcoming !== null && left !== null && left <= 0;
  const onSale = full ? null : upcoming;
  const leads = immersionLeads(now) && !full;

  const immersion = onSale
    ? {
        line: `${ordinalWordOf(onSale)} immersion \u00B7 ${formatDay(onSale)} \u00B7 with ${onSale.partner}`,
        href: "#reserve",
        label: reserveLabelOf(onSale),
      }
    : null;

  // The invitation. While the evening is on sale it offers the evening; after,
  // the same card offers the waitlist alone.
  const invite = onSale
    ? {
        storageSlug: onSale.slug,
        heading: "Before you go.",
        body: [
          `The ${ordinalWordOf(onSale).toLowerCase()} immersion is on ${formatDay(onSale)} at ${formatTime(onSale)}, at ${onSale.venue.replace(", ", " in ")}.`,
          onSale.copy.inviteSummary,
          onSale.openToNonMembers
            ? `${formatInr(onSale.priceInr)}, and you do not have to be a member.`
            : `${formatInr(onSale.priceInr)}.`,
        ].join(" "),
        primary: { href: "#reserve", label: "Reserve a seat" },
        secondary: {
          href: "#waitlist",
          label: "Or join the waitlist for the year",
        },
      }
    : {
        storageSlug: "waitlist",
        heading: "Before you go.",
        body: "Leave an address and you will hear when the next cohort opens.",
        primary: { href: "#waitlist", label: "Join the waitlist" },
        secondary: null,
      };

  // The Immersion item stays while the section has a date to show, full or not;
  // the reserve action only while there is a seat to reserve.
  const nav = upcoming
    ? {
        slot: { href: `#${anchorOf(upcoming)}`, label: "Immersion" },
        ...(leads
          ? { ctaHref: "#reserve", ctaLabel: "Reserve a seat" }
          : { ctaHref: "#waitlist", ctaLabel: "The Waitlist" }),
      }
    : {
        slot: { href: "#demo-door", label: "Demo" },
        ctaHref: "#waitlist",
        ctaLabel: "The Waitlist",
      };

  return (
    <>
      <Nav {...nav} />
      <main>
        {onSale ? <Announcement ev={onSale} /> : null}
        <Cover />
        <Hero
          waitlistHref="#waitlist"
          immersion={immersion}
          immersionLeads={leads}
        />
        <Problem />
        <Baseline />
        <Method />
        <Concierge />
        <Immersions feature={feature} left={left} />
        <TheRoom />
        <WhoFor />
        <ApplicationSection />
        <WaitlistBand />
      </main>
      <Footer />
      <Invitation {...invite} />
    </>
  );
}
