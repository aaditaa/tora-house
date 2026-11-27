import { OnePager } from "@/components/immersion-one/OnePager";
import { anchorOf, type ImmersionEvent } from "@/lib/immersions";

/**
 * The home page's immersion section: the whole one-pager, in place. Nobody has
 * to click through to see the morning; it is all here, and the same booking
 * card, Razorpay link and pixel sequence run from it as on /immersion-one.
 *
 * The id sits on this wrapper, so the announcement bar and the nav arrive here.
 */
export function ImmersionFeature({
  ev,
  past,
  left,
}: {
  ev: ImmersionEvent;
  past: boolean;
  /** Seats left, or null when unknown. */
  left: number | null;
}) {
  return (
    <div id={anchorOf(ev)} className="anchor lp-scope lp-home">
      <OnePager ev={ev} past={past} left={left} variant="home" />
    </div>
  );
}
