import Link from "next/link";

import { ToranaMark } from "@/components/Brand";
import { QuickReserve } from "@/components/immersion-one/QuickReserve";
import { VenueVideo } from "@/components/immersion-one/VenueVideo";
import { TrackOnView } from "@/components/meta/MetaPixel";
import { PartnerMark } from "@/components/PartnerMark";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";
import {
  formatInr,
  formatTime,
  formatWhen,
  fromPrice,
  numberWord,
  plain,
  priceFor,
  type ImmersionEvent,
} from "@/lib/immersions";
import { LANDING_LINKS as LINKS } from "@/lib/landing";

/** "Sat 5 Dec", for the bar at the foot of the screen. */
const SHORT_DAY = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  day: "numeric",
  month: "short",
});

/**
 * The whole morning on one page: the lockup, the film, the facts, both reserve
 * buttons, the six cards, the questions and the closing call. It is the
 * /immersion-one page, and it is also the immersion section of the home page,
 * so the two can never say different things.
 *
 * "page" adds what a page of its own needs: a header, a footer and the bar
 * fixed to the foot of the screen. "home" leaves those to the home page and
 * sits inside it as a section, with its headings a level down and its film
 * loaded only as it comes near.
 *
 * Reserve opens the short booking card on either: the same booking API, the
 * same Razorpay link per booking, the same pixel sequence.
 */
export function OnePager({
  ev,
  past,
  left,
  variant,
}: {
  ev: ImmersionEvent;
  past: boolean;
  /** Seats left, or null when unknown. */
  left: number | null;
  variant: "page" | "home";
}) {
  const page = variant === "page";
  const Title = page ? "h1" : "h3";
  const Label = page ? "h2" : "h4";
  const CardTitle = page ? "h3" : "h5";

  const full = left !== null && left <= 0;
  const open = !past && !full;
  const twoOpen = left === null || left >= 2;

  const one = formatInr(fromPrice(ev));
  const two = formatInr(priceFor(ev, 2) ?? fromPrice(ev));
  const [day, hours] = plain(formatWhen(ev, { range: true })).split(", ");
  const room = ev.seats === null ? "{{SEATS}}" : numberWord(ev.seats);

  const reserveButtons = (
    <>
      <a className="lp-btn" href={LINKS.reserve} data-reserve="1">
        Reserve a seat &middot; {one}
      </a>
      {twoOpen ? (
        <a
          className="lp-btn lp-btn-alt"
          href={LINKS.reserveTwo}
          data-reserve="2"
        >
          Bring someone &middot; {two}
        </a>
      ) : null}
    </>
  );

  const closedNote = past ? (
    <p className="lp-micro">
      This one was held on {day}. The waitlist hears about the next one first.
    </p>
  ) : (
    <p className="lp-micro">
      This one is full. The waitlist hears about the next one first.
    </p>
  );

  const lockup = (
    <div
      className="lp-lock"
      role="img"
      aria-label={`${BRAND_NAME} with ${ev.partner}`}
    >
      <ToranaMark className="lp-mark" />
      <span className="lp-x" aria-hidden="true">
        &times;
      </span>
      <PartnerMark name={ev.partner} />
    </div>
  );

  const body = (
    <>
      <div className="lp-wrap">
        <div className="lp-hero">
          {past ? null : (
            <TrackOnView
              event="ViewContent"
              params={{
                content_name: ev.title,
                content_category: "immersion",
                value: fromPrice(ev),
                currency: "INR",
              }}
            />
          )}
          <p className="lp-ey">
            Immersion One &middot; Women only, 40 to 60 &middot; {ev.city}
          </p>
          <Title className="lp-title">High tea and Pilates.</Title>
          <p className="lp-lede">
            Forty minutes of floor Pilates, a tasting of teas from several
            countries, and the kind of conversation that only happens in a small
            room.
          </p>

          <div className="lp-vid">
            <VenueVideo
              src="/immersion-one/venue.mp4"
              poster="/immersion-one/venue-poster.jpg"
              label="The studio and tea room at Maison de Medusa"
              lazy={!page}
            />
          </div>
          <p className="lp-vcap">The studio and the tea room at {ev.venue}.</p>

          <dl className="lp-facts">
            <div>
              <dt>When</dt>
              <dd>
                {day}
                <br />
                {hours}
              </dd>
            </div>
            <div>
              <dt>Where</dt>
              <dd>
                {ev.partner},
                <br />
                Whitefield, {ev.city}
              </dd>
            </div>
            <div>
              <dt>The room</dt>
              <dd>{room} women, 40 to 60</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>
                {one} a seat
                <br />
                {two} for two, all inclusive
              </dd>
            </div>
          </dl>

          <div className="lp-cta">
            {open ? reserveButtons : closedNote}
            {open ? null : (
              <a className="lp-btn" href={LINKS.waitlist}>
                Join the waitlist
              </a>
            )}
            {open ? (
              <p className="lp-micro">
                You do not have to join anything to come to this one.
              </p>
            ) : null}
            <a className="lp-ask" href={LINKS.contact} data-track="Contact">
              Questions? Message us &rarr;
            </a>
          </div>
        </div>
      </div>

      <div className="lp-section" aria-labelledby="lp-morning">
        <div className="lp-wrap">
          <div className="lp-shead">
            <Label id="lp-morning" className="lp-ey">
              The morning, and the room
            </Label>
            <span className="lp-hint" aria-hidden="true">
              Swipe &rarr;
            </span>
          </div>
          <div
            className="lp-cards"
            tabIndex={0}
            aria-label="Six cards about the morning"
          >
            <article className="lp-card">
              <span className="lp-k">The morning</span>
              <CardTitle className="lp-card-title">
                One hour, and nothing after it.
              </CardTitle>
              <div className="lp-time">
                <b>10:00</b>
                <span>Floor Pilates, forty minutes, instructor-led.</span>
              </div>
              <div className="lp-time">
                <b>10:40</b>
                <span>High tea, and the table.</span>
              </div>
            </article>

            <article className="lp-card">
              <span className="lp-k">Who is in the room</span>
              <CardTitle className="lp-card-title">
                A room of women like you.
              </CardTitle>
              <p>{room} women, 40 to 60. Women only.</p>
              <p>
                You will not be the fittest woman there, and you will not be the
                least.
              </p>
            </article>

            <article className="lp-card">
              <span className="lp-k">What we talk about</span>
              <CardTitle className="lp-card-title">
                The things nobody asks you.
              </CardTitle>
              <p>
                Health, strength, sleep, the years ahead, and the things none of
                us has said out loud in a while.
              </p>
              <p>You arrive knowing nobody. You leave knowing a few.</p>
            </article>

            <article className="lp-card">
              <span className="lp-k">Who is teaching</span>
              <CardTitle className="lp-card-title">
                The teacher behind the curriculum.
              </CardTitle>
              <p>
                A practising yoga teacher with a master&rsquo;s and a PhD in
                physical education. She holds the curriculum at {BRAND_NAME},
                and she will be in the room on Saturday.
              </p>
            </article>

            <article className="lp-card">
              <span className="lp-k">What the seat includes</span>
              <CardTitle className="lp-card-title">
                All of it, for {one}.
              </CardTitle>
              <ul>
                {ev.includes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
                <li>Nothing else to pay on the day</li>
              </ul>
            </article>

            <article className="lp-card">
              <span className="lp-k">After this one</span>
              <CardTitle className="lp-card-title">
                The first of a year.
              </CardTitle>
              <p>
                Immersion One is open to anyone who fits the room. If you want
                the year that follows, there is a waitlist, and nobody will ask
                you about it on the day.
              </p>
            </article>
          </div>
        </div>
      </div>

      <div className="lp-section" aria-labelledby="lp-questions">
        <div className="lp-wrap">
          <Label id="lp-questions" className="lp-ey">
            Questions
          </Label>
          <div className="lp-faq">
            <details>
              <summary>I have never done Pilates.</summary>
              <p>
                Most of the room hasn&rsquo;t. This is floor Pilates, taken
                slowly, with an instructor who adjusts for whoever is in front
                of her. It is a beginner&rsquo;s session by design.
              </p>
            </details>
            <details>
              <summary>What should I wear?</summary>
              <p>
                Something you can move and sit comfortably in. We stay for tea
                afterwards, so wear what you would be happy to have a long
                conversation in.
              </p>
            </details>
            <details>
              <summary>Do I need to bring anything?</summary>
              <p>
                No. The studio provides everything you need, mats included. Come
                as you are.
              </p>
            </details>
            <details>
              <summary>Can I come on my own?</summary>
              <p>
                Most women do. Everyone arrives to a room of people they have
                not met. That is rather the point.
              </p>
            </details>
            <details>
              <summary>What if I cannot make it?</summary>
              <p>
                Tell us at least 24 hours before and you will have a full
                refund. Or move your seat to the next immersion instead,
                whichever suits you better.
              </p>
            </details>
          </div>
        </div>
      </div>

      <div className="lp-section">
        <div className="lp-wrap lp-close">
          <ToranaMark className="lp-close-mark" />
          <Label className="lp-close-title">
            {room} seats, one Saturday morning.
          </Label>
          <div className="lp-cta lp-close-cta">
            {open ? reserveButtons : closedNote}
            <a className="lp-ask" href={LINKS.waitlist}>
              Or join the waitlist for the year &rarr;
            </a>
          </div>
        </div>
      </div>
    </>
  );

  const credits = (
    <p>
      {BRAND_NAME} &times; {ev.partner} &middot; Whitefield, {ev.city} &middot;{" "}
      <a
        href={LINKS.map}
        target="_blank"
        rel="noopener"
        data-track="FindLocation"
      >
        Directions
      </a>{" "}
      &middot;{" "}
      <a href={LINKS.contact} data-track="Contact">
        Email us
      </a>
      {page ? (
        <>
          {" "}
          &middot; <Link href="/privacy">Privacy</Link>
        </>
      ) : null}
    </p>
  );

  const disclaimer = (
    <p className="lp-disclaimer">
      {BRAND_NAME} is not a medical service, and nothing here is medical advice,
      diagnosis or treatment. If you have an injury or a condition that affects
      movement, please speak to your doctor first and tell the instructor on the
      day.
    </p>
  );

  const reserveCard = open ? (
    <QuickReserve
      slug={ev.slug}
      title={ev.title}
      prices={ev.prices}
      summary={`${day}, ${hours} · ${ev.venue}`}
    />
  ) : null;

  if (!page) {
    return (
      <>
        <div className="lp-wrap">{lockup}</div>
        {body}
        <div className="lp-foot">
          <div className="lp-wrap">
            {credits}
            {disclaimer}
          </div>
        </div>
        {reserveCard}
      </>
    );
  }

  return (
    <>
      <div className="lp-wrap">
        <header className="lp-header">{lockup}</header>
      </div>

      <main>{body}</main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          {credits}
          <p className="lp-tagline">{BRAND_TAGLINE}</p>
          {disclaimer}
        </div>
      </footer>

      <div className="lp-bar">
        <div className="lp-bar-inner">
          <div className="lp-px">
            <b>{one}</b>
            <span>
              {SHORT_DAY.format(new Date(ev.startsAt))} &middot;{" "}
              {formatTime(ev)}
            </span>
          </div>
          {open ? (
            <a className="lp-btn" href={LINKS.reserve} data-reserve="1">
              Reserve a seat
            </a>
          ) : (
            <a className="lp-btn" href={LINKS.waitlist}>
              Join the waitlist
            </a>
          )}
        </div>
      </div>

      {reserveCard}
    </>
  );
}
