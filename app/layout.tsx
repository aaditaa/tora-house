import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Jost } from "next/font/google";

import { Grain } from "@/components/Grain";
import { BRAND_NAME, CITY, SITE_URL } from "@/lib/config";

import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-bodoni",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400"],
  display: "swap",
  variable: "--font-jost",
});

const DESCRIPTION = `A members' club for women 40–60. Strength and mobility, yoga, breathwork and meditation, Ayurvedic daily rhythm, and pain management and recovery, sequenced into one plan by one guide, with a city chapter that meets in person every two weeks in ${CITY}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — a members' club for women 40–60`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — a members' club for women 40–60`,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — a members' club for women 40–60`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F3EEE4",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${bodoni.variable} ${jost.variable}`}>
      <body>
        <Grain />
        <div className="site">{children}</div>
      </body>
    </html>
  );
}
