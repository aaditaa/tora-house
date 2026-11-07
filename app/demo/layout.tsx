import type { Metadata } from "next";
import type { ReactNode } from "react";

import { DemoShell } from "@/components/demo/DemoShell";

export const metadata: Metadata = {
  title: "Member journey — sample data",
  description:
    "An illustrative walk-through of the Tora House member journey, on sample data. Not a medical service.",
  // A demo of invented health readings has no business in a search index.
  robots: { index: false, follow: false },
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return <DemoShell>{children}</DemoShell>;
}
