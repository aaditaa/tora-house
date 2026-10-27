import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";

import { Grain } from "@/components/Grain";
import { BRAND_NAME, CITY, SITE_URL } from "@/lib/config";

import "./globals.css";

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

const DESCRIPTION = `A members' club for women 40–60 in ${CITY}. Strength and mobility, yoga, breathwork, sadhana and Ayurvedic daily rhythm, sequenced into one plan by one guide, with a city chapter that meets every two weeks.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BRAND_NAME} — a members' club for women 40–60 in ${CITY}`,
    template: `%s · ${BRAND_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: BRAND_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: BRAND_NAME,
    title: `${BRAND_NAME} — a members' club for women 40–60 in ${CITY}`,
    description: DESCRIPTION,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} — a members' club for women 40–60 in ${CITY}`,
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#F7F3ED",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${instrument.variable} ${inter.variable}`}>
      <body>
        <Grain />
        <div className="site">{children}</div>
      </body>
    </html>
  );
}
