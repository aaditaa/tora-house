"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { DemoBar } from "@/components/demo/DemoBar";
import {
  DemoHeader,
  DemoTabs,
  useIsOnboarding,
} from "@/components/demo/DemoChrome";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { DemoProvider } from "@/lib/demo-state";

/**
 * Screens ported to the reference boards. They draw their own header, ground
 * and tab bar, so the shell hands them the bare phone. Everything not on this
 * list still gets the older chrome, which keeps the demo whole while the port
 * runs board by board rather than leaving twelve screens headless.
 */
const PORTED = new Set([
  "/demo",
  "/demo/consent",
  "/demo/survey",
  "/demo/journey",
  "/demo/book-call",
  "/demo/book-panel",
  "/demo/report",
  "/demo/markers",
  "/demo/today",
  "/demo/plan",
  "/demo/calendar",
  "/demo/guide",
  "/demo/immersions",
  "/demo/progress",
]);

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <Frame>{children}</Frame>
    </DemoProvider>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const onboarding = useIsOnboarding();
  const pathname = usePathname();
  // Prefix match, so /demo/plan/<action> and /demo/markers/<marker> count too.
  const ported = [...PORTED].some(
    (r) => pathname === r || pathname.startsWith(`${r}/`),
  );

  return (
    <div className="demo-root">
      <PhoneFrame>
        {ported ? (
          children
        ) : (
          <>
            <DemoHeader />
            <div className="demo-scroll">{children}</div>
            {onboarding ? null : <DemoTabs />}
          </>
        )}
      </PhoneFrame>
      <DemoBar />
    </div>
  );
}
