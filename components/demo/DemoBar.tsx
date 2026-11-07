"use client";

import { useState } from "react";

import { ToranaMark } from "@/components/Brand";

/**
 * The demo controls. Hidden behind a small mark so a walk-through is not framed by
 * its own scaffolding, and opened when someone wants to jump to Day 15 mid-sentence.
 *
 * The controls themselves land in the next step; this is the bar they sit in.
 */
export function DemoBar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center">
      {open ? (
        <div className="on-dark w-full border-t border-rule bg-ink">
          <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
            <span className="t-eyebrow">Demo controls</span>
            <span className="t-meta text-fg-muted">
              Jump, reveal and reset land next.
            </span>
          </div>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Hide demo controls" : "Show demo controls"}
        className="mb-3 flex items-center gap-2 rounded-full border border-brass bg-ink px-3 py-1.5"
      >
        <ToranaMark className="h-3.5 w-3.5 text-bone" compact />
        <span
          className="t-eyebrow text-[0.5625rem]"
          style={{ color: "var(--bone)" }}
        >
          Demo
        </span>
      </button>
    </div>
  );
}
