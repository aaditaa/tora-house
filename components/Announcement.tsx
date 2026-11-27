import { AnnouncementBar } from "@/components/AnnouncementBar";
import { BRAND_NAME } from "@/lib/config";
import { barKey } from "@/lib/dismiss";
import { LANDING_PATH } from "@/lib/landing";
import {
  areaOf,
  formatDay,
  formatInr,
  fromPrice,
  formatWhen,
  plain,
  type ImmersionEvent,
} from "@/lib/immersions";

/**
 * The bar, rendered visible on the server so no visitor ever sees it arrive.
 *
 * For the visitor who dismissed it, the small script runs before the bar is
 * parsed and marks <html>; CSS then hides the bar before it is ever painted. So
 * neither flash happens: the bar does not pop in for the many, and does not
 * flicker out for the few.
 */
export function Announcement({ ev }: { ev: ImmersionEvent }) {
  const area = areaOf(ev);
  const when = plain(formatWhen(ev));
  const price = formatInr(fromPrice(ev));

  const line = `${BRAND_NAME} × ${ev.partner} · ${ev.title} · ${when} · ${area} · ${price} →`;
  // The fallback for reduced motion on a narrow screen. No arrow: the whole strip
  // is the link, and the arrow is the difference between fitting a 360px phone
  // and being cut off at the price.
  const shortLine = `${ev.title} · ${formatDay(ev)} · ${price}`;
  const label = `${ev.title} with ${ev.partner}, ${when}, ${area}, ${price}. See the details.`;

  const noFlash = `try{if(localStorage.getItem(${JSON.stringify(barKey(ev.slug))}))document.documentElement.setAttribute("data-bar-dismissed","")}catch(e){}`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      <AnnouncementBar
        slug={ev.slug}
        href={LANDING_PATH}
        line={line}
        shortLine={shortLine}
        label={label}
        startsAt={ev.startsAt}
      />
    </>
  );
}
