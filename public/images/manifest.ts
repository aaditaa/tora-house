/**
 * The image system. The site ships without photography; every slot below renders
 * as a warm --linen block carrying its subject note and ratio until the real file
 * is dropped into /public/images/ under the filename given here. No rebuild of the
 * markup is needed — only a rebuild of the app.
 *
 * Alt text is written now, not later. Casting and art direction are a hard brief,
 * not a preference: see PLACEHOLDERS.md.
 */

export type ImageEntry = {
  /** Expected filename inside /public/images/. */
  file: string;
  /** What the frame must show. Rendered in the placeholder block. */
  subject: string;
  /** Required aspect ratio, "w:h". */
  ratio: string;
  /** Real alt text, written now. */
  alt: string;
  /** The page section this slot belongs to. */
  section: string;
};

export const images = {
  hero: {
    file: "hero.jpg",
    subject:
      "Wide, atmospheric. A woman in her fifties in a warm interior shot through a doorway or column, low-angle golden light, half in shadow, placed off-centre with negative space on the left for type. Linen, raw wood, unbleached cotton in frame. No gym equipment, no visible branding.",
    ratio: "3:2",
    alt: "A woman standing in a sunlit room, seen through an open doorway.",
    section: "Hero",
  },
  baseline: {
    file: "baseline.jpg",
    subject:
      "Close and quiet. Hands and a printed panel of results on a wooden table beside a cup, soft diffused window light. A woman in her fifties partly in frame, face turned away. Reads as a consultation, not a clinic.",
    ratio: "4:5",
    alt: "Printed test results on a wooden table beside a cup of tea, in window light.",
    section: "It starts with facts",
  },
  practice: {
    file: "practice.jpg",
    subject:
      "Close and quiet. A woman of about fifty-five mid-movement rather than holding a pose — let the limbs blur slightly. Sage wall, terracotta floor, soft diffused light. Grey hair visible. No posed asana.",
    ratio: "4:5",
    alt: "A woman mid-movement during a practice session, her arms slightly blurred.",
    section: "The method",
  },
  room: {
    file: "room.jpg",
    subject:
      "Wide and atmospheric. Six to eight women between forty and sixty in a warm room after a session, talking, some seated on the floor. Real bodies, grey hair present, Indian women predominantly, shot in an Indian space. Golden low-angle light. Type will be overlaid lower-left, so keep that quarter of the frame quiet.",
    ratio: "3:2",
    alt: "A group of women talking together in a warm, low-lit room after a session.",
    section: "The room",
  },
  guide: {
    file: "guide.jpg",
    subject:
      "Portrait of the named lead guide. Soft window light, warm neutral ground, shoulders square to camera, no studio white. Shot in the space where the practice actually happens.",
    ratio: "1:1",
    alt: "Portrait of the lead guide who holds the curriculum.",
    section: "The method",
  },
  retreat: {
    file: "retreat.jpg",
    subject:
      "Wide. A small group walking or sitting outdoors at a retreat property at first light — architectural framing through a verandah or colonnade. Atmospheric, with people doing something in it. Not an empty infinity pool, not a sunset terrace.",
    ratio: "16:9",
    alt: "A small group of women outdoors at a retreat property in early morning light.",
    section: "The room",
  },
} satisfies Record<string, ImageEntry>;

export type ImageSlug = keyof typeof images;
