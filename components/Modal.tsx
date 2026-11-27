"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FADE_MS = 400;

/**
 * One quiet card over a 55% Ink scrim: the invitation and the Pay step both use
 * it. It fades in and out over 400ms with no scale, holds the page still, keeps
 * Tab inside, closes on Escape, the scrim or ×, and hands focus back to whatever
 * had it when it opened.
 *
 * Focus lands on the element with id `initialFocus` if given, else on the one
 * marked data-autofocus, otherwise on the first focusable thing in the card.
 */
export function Modal({
  open,
  onClose,
  labelledBy,
  initialFocus,
  children,
}: {
  open: boolean;
  onClose: () => void;
  /** The id of the card's heading. */
  labelledBy: string;
  /** The id of the element to focus first, such as a form's first field. */
  initialFocus?: string;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(open);
  const [shown, setShown] = useState(false);
  const card = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);

  // Mount, then fade in on the next frame so there is a from-state; fade out,
  // then unmount.
  useEffect(() => {
    if (open) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Focus in, page held still, Tab kept inside, Escape out.
  useEffect(() => {
    if (!open) return;
    opener.current = document.activeElement;
    const frame = requestAnimationFrame(() => {
      const el = card.current;
      const target =
        (initialFocus
          ? el?.querySelector<HTMLElement>(`#${CSS.escape(initialFocus)}`)
          : null) ??
        el?.querySelector<HTMLElement>("[data-autofocus]") ??
        el?.querySelector<HTMLElement>(FOCUSABLE);
      target?.focus();
    });

    const { body: page, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const overflow = page.style.overflow;
    const padding = page.style.paddingRight;
    page.style.overflow = "hidden";
    if (gutter > 0) page.style.paddingRight = `${gutter}px`;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKey);
      page.style.overflow = overflow;
      page.style.paddingRight = padding;
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, [open, onClose, initialFocus]);

  if (!mounted) return null;

  return createPortal(
    <div
      className="invite"
      data-shown={shown ? "true" : undefined}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={card}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        className="invite-card"
      >
        <button
          type="button"
          className="invite-close"
          onClick={onClose}
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
        {children}
      </div>
    </div>,
    document.body,
  );
}
