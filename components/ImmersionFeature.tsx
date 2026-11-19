import { Fragment } from "react";

import { ToranaMark } from "@/components/Brand";
import { ImmersionBooking } from "@/components/ImmersionBooking";
import { PartnerMark } from "@/components/PartnerMark";
import { Reveal } from "@/components/Reveal";
import { BRAND_NAME } from "@/lib/config";
import {
  formatDay,
  formatFormat,
  formatInr,
  anchorOf,
  formatWhen,
  ordinalOf,
  reserveLabelOf,
  seatCopy,
  seatsWord,
  type ImmersionEvent,
} from "@/lib/immersions";
import { MAX_SEATS_PER_BOOKING } from "@/lib/schemas";

/**
 * One immersion, rendered from its object. The quiet grid of four categories
 * above it resolves here into one real, dated thing, so the surface changes under
 * the reader at the point a price and a date appear: Ink, bone type, one brass
 * hairline.
 *
 * Ink rather than vetiver, because brass is 4.79:1 on ink and 3.22:1 on vetiver,
 * and the eyebrow is brass type.
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
  const seats = seatCopy(ev.seats, left);
  const full = !past && seats.state === "full";
  const n = ordinalOf(ev);

  const details: { term: string; detail: string }[] = [
    { term: "Format", detail: formatFormat(ev) },
    { term: "Where", detail: ev.venue },
    { term: "When", detail: formatWhen(ev, { range: true }) },
  ];
  if (!past) {
    details.push(
      { term: "Seats", detail: seats.detail },
      {
        term: "Price",
        detail: `${formatInr(ev.priceInr)} per person, all inclusive`,
      },
    );
  }

  return (
    // The id sits on a plain wrapper: Reveal takes no id, and an anchor on it would
    // be dropped without a word. The panel is there on first paint; its contents
    // fade in.
    <div id={anchorOf(ev)} className="anchor on-dark immersion-panel">
      <Reveal delay={120}>
        <div
          className="immersion-lockup"
          role="img"
          aria-label={`${BRAND_NAME} with ${ev.partner}`}
        >
          <span className="immersion-lockup-torana">
            <ToranaMark className="h-full w-full" />
          </span>
          <svg
            className="immersion-lockup-x"
            viewBox="0 0 10 10"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M1 1l8 8M9 1l-8 8"
              stroke="var(--brass)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
          </svg>
          <span className="immersion-lockup-partner">
            <PartnerMark name={ev.partner} />
          </span>
        </div>

        <hr className="immersion-hairline" />

        {/* Source order is copy, details, actions: on a phone she sees the date and
            the price before the button. On desktop the details span both rows, so
            the actions rise to sit under the copy instead of under the taller
            column beside it. */}
        <div className="grid-12 items-start gap-y-12">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-7 lg:row-start-1">
            <p className="t-eyebrow" style={{ color: "var(--accent-type)" }}>
              {past
                ? `Immersion ${n} · ${ev.city} · Held ${formatDay(ev)}`
                : `Immersion ${n} · ${ev.city} · ${formatDay(ev)}`}
            </p>
            <h3 className="t-h2">{ev.copy.headline}</h3>
            <p className="t-lede">{ev.copy.lede}</p>
            {past ? null : (
              <p className="t-body">
                {ev.copy.body.replace("{seats}", seatsWord(ev.seats))}
              </p>
            )}
          </div>

          <div className="col-span-12 flex flex-col gap-10 lg:col-span-4 lg:col-start-9 lg:row-span-2 lg:row-start-1">
            <dl className="immersion-details">
              {details.map((row) => (
                <Fragment key={row.term}>
                  <dt className="t-eyebrow">{row.term}</dt>
                  <dd>{row.detail}</dd>
                </Fragment>
              ))}
            </dl>

            <div className="flex flex-col gap-4">
              <hr className="rule" />
              <p className="t-eyebrow">Included</p>
              <ul className="flex flex-col gap-2.5">
                {ev.includes.map((line) => (
                  <li key={line} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className="mt-[0.7em] h-px w-4 flex-none bg-brass"
                    />
                    <span className="t-body">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="col-span-12 flex flex-col gap-8 lg:col-span-7 lg:col-start-1 lg:row-start-2">
            {/* Not when it is full: an open door above "This one is full" reads
                as a mistake. */}
            {!past && !full && ev.openToNonMembers ? (
              <div className="flex flex-col gap-5">
                <hr className="rule-brass" />
                <p className="t-statement max-w-[30ch]">
                  You do not have to join anything to come to this one.
                </p>
              </div>
            ) : null}

            {past ? (
              <div className="flex flex-col gap-5">
                <p className="t-body">
                  Join the waitlist to hear when the next one is set.
                </p>
                <div>
                  <a href="#waitlist" className="btn btn-brass">
                    Join the waitlist
                  </a>
                </div>
              </div>
            ) : full ? (
              <div className="flex flex-col gap-5">
                <p className="t-body">{seats.line}</p>
                <div>
                  <a href="#waitlist" className="btn btn-brass">
                    Join the waitlist for the next one
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {seats.state === "few" ? (
                  <p className="t-meta" style={{ color: "var(--accent-type)" }}>
                    {seats.line}
                  </p>
                ) : null}
                <ImmersionBooking
                  slug={ev.slug}
                  reserveLabel={reserveLabelOf(ev)}
                  maxSeats={Math.min(
                    MAX_SEATS_PER_BOOKING,
                    left ?? MAX_SEATS_PER_BOOKING,
                  )}
                  paymentUrl={ev.paymentUrl}
                />
              </div>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
