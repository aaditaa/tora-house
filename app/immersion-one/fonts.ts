import { Bodoni_Moda, Jost } from "next/font/google";

/**
 * The landing page's own cut of the two house faces, loaded on this page only.
 *
 * Bodoni with its optical-size axis, so the page can set it at opsz 14 and
 * weight 550: at the default high optical size its hairlines vanish at body
 * sizes and it reads as half-drawn. The rest of the site keeps the cut it has.
 * Jost adds 500, for the uppercase labels and buttons.
 */
export const bodoniLanding = Bodoni_Moda({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-bodoni-landing",
});

export const jostLanding = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
  variable: "--font-jost-landing",
});
