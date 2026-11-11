"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Reveal } from "@/components/Reveal";

const FOCUSABLE =
  'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/**
 * The way into the member demo from the marketing page.
 *
 * It opens the Method section rather than standing on its own: the method's own
 * introduction said what the five pillars below it say, so the app took its
 * place. This is a block meant for one column of a grid, not a section — the
 * section around it belongs to Method.
 *
 * The demo is loaded in an iframe of /demo rather than mounted inline: it already
 * draws its own phone frame on a vetiver ground, it holds its own state in
 * localStorage, and keeping it behind a document boundary means none of that can
 * reach this page. Nothing of it is fetched until the button is pressed.
 */
export function DemoDoor({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div id="demo-door" className={`anchor ${className}`}>
      <Reveal className="flex flex-col items-start gap-6">
        <hr className="rule-brass" />
        <p className="t-eyebrow">The member app</p>
        <h2 className="t-h2">
          See what the year actually{" "}
          <span className="em-serif">looks like</span>.
        </h2>
        <p className="t-body">
          The questionnaire your guide takes you through, the baseline read
          against its bands, the plan that comes out of it, and the day it asks
          of you. All of it on invented data, for one invented member.
        </p>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => setOpen(true)}
          >
            See the member journey <span aria-hidden="true">&rarr;</span>
          </button>
          <p className="t-meta text-fg-muted">
            A three-minute walk-through, on sample data.
          </p>
        </div>

        {open ? <DemoModal onClose={() => setOpen(false)} /> : null}
      </Reveal>
    </div>
  );
}

function DemoModal({ onClose }: { onClose: () => void }) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Remember who opened us before the portal exists, and return focus there.
  useEffect(() => {
    opener.current = document.activeElement;
    return () => {
      if (opener.current instanceof HTMLElement) opener.current.focus();
    };
  }, []);

  // Focus moves only once the portal has rendered. On the first pass this
  // component returns null, so a mount-time focus would land on nothing and
  // leave the trap guarding a dialog that focus had never entered.
  useEffect(() => {
    if (mounted) closeButton.current?.focus();
  }, [mounted]);

  // Hold the page still underneath. The gutter is replaced so the page does not
  // jump sideways as the scrollbar goes.
  useEffect(() => {
    const { body, documentElement } = document;
    const gutter = window.innerWidth - documentElement.clientWidth;
    const overflow = body.style.overflow;
    const padding = body.style.paddingRight;
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;
    return () => {
      body.style.overflow = overflow;
      body.style.paddingRight = padding;
    };
  }, []);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const el = dialog.current;
      if (!el) return;
      const items = [...el.querySelectorAll<HTMLElement>(FOCUSABLE)];
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
    },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  /** Escape has to work once focus is inside the demo, which is its own document. */
  const wireFrame = useCallback(
    (frame: HTMLIFrameElement | null) => {
      if (!frame) return;
      const attach = () => {
        try {
          const inner = frame.contentDocument;
          if (!inner) return;
          inner.addEventListener("keydown", (e) => {
            if ((e as KeyboardEvent).key === "Escape") onClose();
          });
        } catch {
          /* A cross-origin frame keeps its own keys. Nothing to do. */
        }
      };
      frame.addEventListener("load", attach);
      attach();
    },
    [onClose],
  );

  if (!mounted) return null;

  return createPortal(
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="The member app — a walk-through on sample data"
      className="demo-door"
    >
      <div className="demo-door-stage on-dark">
        <div className="demo-door-copy">
          <p className="t-eyebrow">The member journey</p>
          <h2>
            See what the
            <br />
            year looks like
          </h2>
          <p>
            A three-minute walk-through, on sample data. Nothing here is a real
            member.
          </p>
        </div>

        <iframe
          ref={wireFrame}
          src="/demo"
          title="The Tora House member app, running on sample data"
          className="demo-door-frame"
        />
      </div>

      <p className="demo-door-mark">Sample data · illustrative demo</p>

      <button
        ref={closeButton}
        type="button"
        onClick={onClose}
        className="demo-door-close"
        aria-label="Close the walk-through"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </div>,
    document.body,
  );
}
