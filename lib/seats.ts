import { paidSeats } from "@/db/queries";
import type { ImmersionEvent } from "@/lib/immersions";

/**
 * Seats left: the room size minus paid seats. Server-only, because it reads the
 * database; it lives apart from lib/immersions.ts so that file stays safe to
 * import into the browser.
 *
 * Null when the room size is not set yet, or when the count cannot be read. The
 * page then shows the room size instead of guessing at what is left of it, and a
 * build on a machine with no database still renders.
 */
export async function seatsLeft(ev: ImmersionEvent): Promise<number | null> {
  if (ev.seats === null) return null;
  try {
    return Math.max(0, ev.seats - (await paidSeats(ev.slug)));
  } catch {
    return null;
  }
}
