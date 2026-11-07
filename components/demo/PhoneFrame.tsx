"use client";

import type { ReactNode } from "react";

/**
 * The phone. A fixed viewport that scrolls internally, on a Vetiver ground so the
 * Bone screen reads as a device rather than as a page. Below 480px the frame is
 * dropped entirely — a phone drawn on a phone is just a smaller phone.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="demo-stage">
      <div className="demo-phone">{children}</div>
    </div>
  );
}
