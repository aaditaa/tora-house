"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import {
  BOOKED_KEY,
  INVITE_SHOWN_KEY,
  JOINED_KEY,
  inviteKey,
} from "@/lib/dismiss";

const SCROLL_SHARE = 0.6;
const MIN_DWELL_MS = 45_000;
const DISMISS_DAYS = 30;
const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

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
 * never dismissed. On a desktop, the pointer leaving through the top of the
 * window may bring it forward, but only once the reader is past 60% too.
 *
 * Never on a first paint, never before 60% on a phone, never twice, and only on
 * the home page: it is mounted nowhere else.
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
  const [shown, setShown] = useState(false);
  const mountedAt = useRef(0);
  const opener = useRef<Element | null>(null);
  const card = useRef<HTMLDivElement>(null);
  const key = inviteKey(storageSlug);

  const eligible = useCallback(() => {
    const session = storage("session");
    if (session?.getItem(BOOKED_KEY) || session?.getItem(JOINED_KEY)) {
      return false;
    }
    if (session?.getItem(INVITE_SHOWN_KEY)) return false;
    return !dismissed(key);
  }, [key]);

  const show = useCallback(() => {
    if (!eligible()) return;
    storage("session")?.setItem(INVITE_SHOWN_KEY, "1");
    opener.current = document.activeElement;
    setOpen(true);
  }, [eligible]);

  // The triggers. Checked on scroll and once the dwell has passed; the first
  // time every condition holds, it opens, and nothing re-arms it.
  useEffect(() => {
    mountedAt.current = Date.now();
    if (!eligible()) return;

    let done = false;
    const check = () => {
      if (done) return;
      const longEnough = Date.now() - mountedAt.current >= MIN_DWELL_MS;
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

    const timer = window.setTimeout(check, MIN_DWELL_MS + 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [eligible, show]);

  const close = useCallback(() => {
    storage("local")?.setItem(
      key,
      String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000),
    );
    setShown(false);
    // Let the fade run before unmounting.
    window.setTimeout(() => setOpen(false), 400);
    if (opener.current instanceof HTMLElement) opener.current.focus();
  }, [key]);

  // Fade in on the frame after mount, so there is a from-state to fade from.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Focus in, page held still, Tab kept inside, Escape out.
  useEffect(() => {
    if (!open) return;
    card.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();

    const { body: page, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const overflow = page.style.overflow;
    const padding = page.style.paddingRight;
    page.style.overflow = "hidden";
    if (gutter > 0) page.style.paddingRight = `${gutter}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !card.current) return;
      const items = [...card.current.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      page.style.overflow = overflow;
      page.style.paddingRight = padding;
    };
  }, [open, close]);

  if (!open) return null;

  return createPortal(
    <div
      className="invite"
      data-shown={shown ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-heading"
        className="invite-card"
      >
        <button
          type="button"
          className="invite-close"
          onClick={close}
          aria-label="Close"
        >
          <svg viewBox="0 0 10 10" aria-hidden="true" focusable="false">
            <path
              d="M2 2l6 6M8 2l-6 6"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
            />
          </svg>
        </button>

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
      </div>
    </div>,
    document.body,
  );
}
