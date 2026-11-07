"use client";

import type { ReactNode } from "react";

import { DemoBar } from "@/components/demo/DemoBar";
import {
  DemoHeader,
  DemoTabs,
  useIsOnboarding,
} from "@/components/demo/DemoChrome";
import { PhoneFrame } from "@/components/demo/PhoneFrame";
import { DemoProvider } from "@/lib/demo-state";

export function DemoShell({ children }: { children: ReactNode }) {
  return (
    <DemoProvider>
      <Frame>{children}</Frame>
    </DemoProvider>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const onboarding = useIsOnboarding();

  return (
    <div className="demo-root">
      <PhoneFrame>
        <DemoHeader />
        <div className="demo-scroll">{children}</div>
        {onboarding ? null : <DemoTabs />}
      </PhoneFrame>
      <DemoBar />
    </div>
  );
}
