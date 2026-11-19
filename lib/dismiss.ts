/**
 * The browser-storage keys behind "never twice". Kept in a plain module so the
 * server can write the no-flash script with the same key the client reads.
 *
 * Every read and write of these is wrapped in try/catch at the call site:
 * storage can be missing or throw in a private window, and the page has to
 * render correctly without it.
 */

/** localStorage. Keyed by slug, so dismissing this event never hides the next. */
export function barKey(slug: string): string {
  return `tora-bar-dismissed:${slug}`;
}

/** localStorage, with an expiry stored as the value. 30 days, per event. */
export function inviteKey(slug: string): string {
  return `tora-invite-dismissed:${slug}`;
}

/** sessionStorage. Someone who booked or joined this session is never invited. */
export const BOOKED_KEY = "tora-booked";
export const JOINED_KEY = "tora-joined";
/** sessionStorage. The invitation has been shown once this session. */
export const INVITE_SHOWN_KEY = "tora-invite-shown";
