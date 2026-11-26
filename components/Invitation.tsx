"use client";

import { useCallback, useEffect, useState } from "react";

import { Modal } from "@/components/Modal";
import {
  BOOKED_KEY,
  BOOKING_STARTED_EVENT,
  BOOKING_STARTED_KEY,
  INVITE_SHOWN_KEY,
  JOINED_KEY,
  inviteKey,
} from "@/lib/dismiss";

const SCROLL_SHARE = 0.6;
const MIN_DWELL_MS = 45_000;
const DISMISS_DAYS = 30;

type Ask = { href: string; label: string };

function storage(kind: "local" | "session"): Storage | null {
  try {
    return kind === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

/** Dismissed within the last thirty days, for this event. */
function dismissed(key: string): boolean {
  const raw = storage("local")?.getItem(key);
  return raw ? Number(raw) > Date.now() : false;
}

function scrolledShare(): number {
  const room = document.documentElement.scrollHeight - window.innerHeight;
  return room <= 0 ? 1 : window.scrollY / room;
}

/**
 * One quiet card, late, once. A modal is the easiest way to undo everything the
 * rest of this page does, so it waits until every condition holds: past 60% of
 * the page, at least 45 seconds on it, nothing booked or joined this session,
 * the booking form never opened, never dismissed. On a desktop, the pointer
 * leaving through the top of the window may bring it forward, but only once the
 * reader is past 60% too.
 *
 * Never on a first paint, never before 60% on a phone, never twice, never in the
 * middle of a booking, and only on the home page: it is mounted nowhere else.
 */
export function Invitation({
  storageSlug,
  heading,
  body,
  primary,
  secondary,
}: {
  /** The event slug while one is on sale, or "waitlist" after. */
  storageSlug: string;
  heading: string;
  body: string;
  primary: Ask;
  secondary: Ask | null;
}) {
  const [open, setOpen] = useState(false);
  const key = inviteKey(storageSlug);

  const eligible = useCallback(() => {
    const session = storage("session");
    if (
      session?.getItem(BOOKED_KEY) ||
      session?.getItem(JOINED_KEY) ||
      session?.getItem(BOOKING_STARTED_KEY) ||
      session?.getItem(INVITE_SHOWN_KEY)
    ) {
      return false;
    }
    return !dismissed(key);
  }, [key]);

  const show = useCallback(() => {
    if (!eligible()) return;
    storage("session")?.setItem(INVITE_SHOWN_KEY, "1");
    setOpen(true);
  }, [eligible]);

  // The triggers. Checked on scroll and once the dwell has passed; the first
  // time every condition holds, it opens, and nothing re-arms it. Opening the
  // booking form disarms it for good.
  useEffect(() => {
    const mountedAt = Date.now();
    if (!eligible()) return;

    let done = false;
    const check = () => {
      if (done) return;
      const longEnough = Date.now() - mountedAt >= MIN_DWELL_MS;
      if (longEnough && scrolledShare() >= SCROLL_SHARE) {
        done = true;
        show();
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        check();
      });
    };

    // Exit intent, desktop only: a fine pointer leaving through the top edge.
    const fine = window.matchMedia("(pointer: fine)").matches;
    const onLeave = (e: MouseEvent) => {
      if (done || !fine) return;
      if (e.relatedTarget === null && e.clientY <= 0) {
        if (scrolledShare() >= SCROLL_SHARE) {
          done = true;
          show();
        }
      }
    };

    const onBooking = () => {
      done = true;
    };

    const timer = window.setTimeout(check, MIN_DWELL_MS + 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    window.addEventListener(BOOKING_STARTED_EVENT, onBooking);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
      window.removeEventListener(BOOKING_STARTED_EVENT, onBooking);
    };
  }, [eligible, show]);

  const close = useCallback(() => {
    storage("local")?.setItem(
      key,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
    );
    setOpen(false);
  }, [key]);

  return (
    <Modal open={open} onClose={close} labelledBy="invite-heading">
      <h2 id="invite-heading" className="t-h3">
        {heading}
      </h2>
      <p className="t-body">{body}</p>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
        <a href={primary.href} className="btn btn-brass" onClick={close}>
          {primary.label}
        </a>
        {secondary ? (
          <a href={secondary.href} className="t-meta link" onClick={close}>
            {secondary.label}
          </a>
        ) : null}
      </div>
    </Modal>
  );
}
