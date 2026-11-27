import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { preload } from "react-dom";

import { ToranaMark } from "@/components/Brand";
import { QuickReserve } from "@/components/immersion-one/QuickReserve";
import { VenueVideo } from "@/components/immersion-one/VenueVideo";
import { TrackOnView } from "@/components/meta/MetaPixel";
import { PartnerMark } from "@/components/PartnerMark";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/config";
import {
  formatDay,
  formatInr,
  formatTime,
  formatWhen,
  fromPrice,
  immersions,
  numberWord,
  plain,
  priceFor,
  startOf,
} from "@/lib/immersions";
import { LANDING_LINKS as LINKS } from "@/lib/landing";
import { seatsLeft } from "@/lib/seats";

import { bodoniLanding, jostLanding } from "./fonts";

/** "Sat 5 Dec", for the bar at the foot of the screen. */
const SHORT_DAY = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  weekday: "short",
  day: "numeric",
  month: "short",
});

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
 * Single column at every width, the reserve button always in reach through the
 * bar at the foot of the screen, and the booking itself the same as the home
 * page's, so the seat hold, the Razorpay link and the pixel all behave alike.
 */
export default async function ImmersionOnePage() {
  // The poster is the first large thing on a phone, so it is fetched first,
  // before the browser would otherwise find it on the video element.
  preload("/immersion-one/venue-poster.jpg", {
    as: "image",
    fetchPriority: "high",
  });

  const now = new Date();
  const past = startOf(ev).getTime() <= now.getTime();
  const left = past ? null : await seatsLeft(ev);
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

  return (
    <div
      className={`landing ${bodoniLanding.variable} ${jostLanding.variable}`}
    >
      <div className="lp-wrap">
        <header className="lp-header">
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
        </header>
      </div>

      <main>
        <div className="lp-wrap">
          <div className="lp-hero">
            <TrackOnView
              event="ViewContent"
              params={{
                content_name: ev.title,
                content_category: "immersion",
                value: fromPrice(ev),
                currency: "INR",
              }}
            />
            <p className="lp-ey">
              Immersion One &middot; Women only, 40 to 60 &middot; {ev.city}
            </p>
            <h1>High tea and Pilates.</h1>
            <p className="lp-lede">
              Forty minutes of floor Pilates, a tasting of teas from several
              countries, and the kind of conversation that only happens in a
              small room.
            </p>

            <div className="lp-vid">
              <VenueVideo
                src="/immersion-one/venue.mp4"
                poster="/immersion-one/venue-poster.jpg"
                label="The studio and tea room at Maison de Medusa"
              />
            </div>
            <p className="lp-vcap">
              The studio and the tea room at {ev.venue}.
            </p>

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

        <section className="lp-section" aria-labelledby="lp-morning">
          <div className="lp-wrap">
            <div className="lp-shead">
              <h2 id="lp-morning" className="lp-ey">
                The morning, and the room
              </h2>
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
                <h3>One hour, and nothing after it.</h3>
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
                <h3>A room of women like you.</h3>
                <p>{room} women, 40 to 60. Women only.</p>
                <p>
                  You will not be the fittest woman there, and you will not be
                  the least.
                </p>
              </article>

              <article className="lp-card">
                <span className="lp-k">What we talk about</span>
                <h3>The things nobody asks you.</h3>
                <p>
                  Health, strength, sleep, the years ahead, and the things none
                  of us has said out loud in a while.
                </p>
                <p>You arrive knowing nobody. You leave knowing a few.</p>
              </article>

              <article className="lp-card">
                <span className="lp-k">Who is teaching</span>
                <h3>The teacher behind the curriculum.</h3>
                <p>
                  A practising yoga teacher with a master&rsquo;s and a PhD in
                  physical education. She holds the curriculum at {BRAND_NAME},
                  and she will be in the room on Saturday.
                </p>
              </article>

              <article className="lp-card">
                <span className="lp-k">What the seat includes</span>
                <h3>All of it, for {one}.</h3>
                <ul>
                  {ev.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                  <li>Nothing else to pay on the day</li>
                </ul>
              </article>

              <article className="lp-card">
                <span className="lp-k">After this one</span>
                <h3>The first of a year.</h3>
                <p>
                  Immersion One is open to anyone who fits the room. If you want
                  the year that follows, there is a waitlist, and nobody will
                  ask you about it on the day.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="lp-section" aria-labelledby="lp-questions">
          <div className="lp-wrap">
            <h2 id="lp-questions" className="lp-ey">
              Questions
            </h2>
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
                  No. The studio provides everything you need, mats included.
                  Come as you are.
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
        </section>

        <section className="lp-section">
          <div className="lp-wrap lp-close">
            <ToranaMark className="lp-close-mark" />
            <h2>{room} seats, one Saturday morning.</h2>
            <div className="lp-cta lp-close-cta">
              {open ? reserveButtons : closedNote}
              <a className="lp-ask" href={LINKS.waitlist}>
                Or join the waitlist for the year &rarr;
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="lp-footer">
        <div className="lp-wrap">
          <p>
            {BRAND_NAME} &times; {ev.partner} &middot; Whitefield, {ev.city}{" "}
            &middot;{" "}
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
            </a>{" "}
            &middot; <Link href="/privacy">Privacy</Link>
          </p>
          <p className="lp-tagline">{BRAND_TAGLINE}</p>
          <p className="lp-disclaimer">
            {BRAND_NAME} is not a medical service, and nothing here is medical
            advice, diagnosis or treatment. If you have an injury or a condition
            that affects movement, please speak to your doctor first and tell
            the instructor on the day.
          </p>
        </div>
      </footer>

      <div className="lp-bar">
        <div className="lp-bar-inner">
          <div className="lp-px">
            <b>{one}</b>
            <span>
              {SHORT_DAY.format(startOf(ev))} &middot; {formatTime(ev)}
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

      {open ? (
        <QuickReserve
          slug={ev.slug}
          title={ev.title}
          prices={ev.prices}
          summary={`${day}, ${hours} · ${ev.venue}`}
        />
      ) : null}
    </div>
  );
}
