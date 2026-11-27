import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";

import { OnePager } from "@/components/immersion-one/OnePager";
import { BRAND_NAME } from "@/lib/config";
import {
  formatDay,
  formatInr,
  formatWhen,
  fromPrice,
  immersions,
  plain,
  startOf,
} from "@/lib/immersions";
import { seatsLeft } from "@/lib/seats";

/** Re-render hourly, as the home page does, so a full room shows as full. */
export const revalidate = 3600;

const ev = immersions.find((x) => x.slug === "high-tea-and-pilates")!;

export const metadata: Metadata = {
  title: `${ev.title} · Immersion One`,
  description:
    "A women-only morning in Whitefield, Bengaluru. Forty minutes of floor Pilates, an international high tea tasting, and a closed-group conversation. Saturday 5 December, 10–11am.",
  alternates: { canonical: "/immersion-one" },
  openGraph: {
    title: `${ev.title} · ${BRAND_NAME}`,
    description: `Women only, 40 to 60. ${formatDay(ev)}, ${plain(formatWhen(ev, { range: true })).split(", ")[1]}, Whitefield. ${formatInr(fromPrice(ev))} a seat.`,
    url: "/immersion-one",
    images: [
      { url: "/immersion-one/venue-poster.jpg", width: 960, height: 720 },
    ],
  },
};

// viewport-fit=cover, so the sticky bar can sit above the iPhone home indicator.
export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#17211C",
};

/**
 * Immersion One, the page the Meta ads land on. One job: a paid reservation.
 * The same one-pager is the home page's immersion section.
 */
export default async function ImmersionOnePage() {
  // The poster is the first large thing on a phone, so it is fetched first,
  // before the browser would otherwise find it on the video element.
  preload("/immersion-one/venue-poster.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  const past = startOf(ev).getTime() <= Date.now();
  const left = past ? null : await seatsLeft(ev);

  return (
    <div className="landing lp-scope">
      <OnePager ev={ev} past={past} left={left} variant="page" />
    </div>
  );
}
