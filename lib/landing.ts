/**
 * The five links on /immersion-one. Edit these; nothing else on the page has to
 * change.
 *
 * reserve and reserveTwo are not fixed payment links: each opens the short
 * booking card, which makes a Razorpay link for exactly that booking and goes
 * straight to it. A fixed link could not hold a seat, mark it paid, or tell the
 * pixel which booking paid.
 */
/** The immersion's own page, where every immersion link on the site now lands. */
export const LANDING_PATH = "/immersion-one";
/** The same page with the reserve card already open, for one seat. */
export const LANDING_RESERVE = `${LANDING_PATH}#reserve-1`;

export const LANDING_LINKS = {
  reserve: "#reserve-1",
  reserveTwo: "#reserve-2",
  // Spelt as the brief gives it. Check it: the house name has one r.
  contact:
    "mailto:thetorrahouse@gmail.com?subject=Question%20about%20the%205%20December%20immersion",
  // A search for the venue. Swap in the exact pin from Google Maps when you have it.
  map: "https://www.google.com/maps/search/?api=1&query=Maison%20de%20Medusa%2C%20Whitefield%2C%20Bengaluru",
  waitlist: "/#waitlist",
} as const;
