/**
 * The image system. Each slot renders at its stated ratio; drop a correctly named
 * file into /public/images/ at that ratio and rebuild, and the slot fills itself.
 *
 * The six slots are currently filled with the stand-in photography supplied with the
 * brand assets, cropped to take as much of each frame as it allows without the
 * headline type another brand had set over it. The subject notes below remain the
 * commissioning brief for the real shoot; casting and art direction are a hard
 * requirement, not a preference, and are set out in PLACEHOLDERS.md.
 */

export type ImageEntry = {
  /** Expected filename inside /public/images/. */
  file: string;
  /** What the frame must show. Rendered in the placeholder block. */
  subject: string;
  /** Required aspect ratio, "w:h". The layout box takes its shape from this. */
  ratio: string;
  /** Real alt text, describing what is actually in the frame today. */
  alt: string;
  /** The page section this slot belongs to. */
  section: string;
  /**
   * Where to hold the frame when the slot's box is a different shape from the
   * file — any CSS object-position. Defaults to the centre.
   */
  focus?: string;
};

export const images = {
  hero: {
    file: "hero.jpg",
    subject:
      "Wide, atmospheric. A woman in her fifties in a warm interior shot through a doorway or column, low-angle golden light, half in shadow, placed off-centre with negative space for type. Linen, raw wood, unbleached cotton in frame. No gym equipment, no visible branding.",
    ratio: "3:2",
    alt: "A woman with her eyes lowered, water beading across her shoulder in warm low light.",
    section: "Hero",
  },
  baseline: {
    file: "baseline.jpg",
    subject:
      "Close and quiet. Hands and a printed panel of results on a wooden table beside a cup, soft diffused window light. A woman in her fifties partly in frame, face turned away. Reads as a consultation, not a clinic.",
    ratio: "4:5",
    alt: "Yellow petals resting on skin in soft, low light.",
    section: "It starts with facts",
  },
  practice: {
    file: "practice.jpg",
    subject:
      "A woman of about fifty-five mid-movement rather than holding a pose — let the limbs blur slightly. Sage wall, terracotta floor, soft diffused light. Grey hair visible. No posed asana.",
    ratio: "4:5",
    alt: "A woman with grey hair reaching both arms overhead, eyes closed, against an open sky.",
    section: "The method",
  },
  guide: {
    file: "guide.jpg",
    subject:
      "The named lead guide. Soft window light, warm neutral ground, shoulders square to camera, no studio white. Shot in the space where the practice actually happens. The real portrait should be square; this slot is 3:2 only because the stand-in is.",
    ratio: "3:2",
    alt: "Two women side by side, one older and one younger, looking into the lens.",
    section: "The method",
  },
  room: {
    file: "room.jpg",
    subject:
      "Six to eight women between forty and sixty in a warm room after a session, talking, some seated on the floor. Real bodies, grey hair present, Indian women predominantly, shot in an Indian space. Golden low-angle light. Type is overlaid lower-left, so keep that quarter of the frame quiet.",
    ratio: "3:2",
    alt: "Two women seated on the floor, one holding the other's hand across a folded blanket.",
    section: "The room",
    focus: "center 62%",
  },
  retreat: {
    file: "retreat.jpg",
    subject:
      "A small group walking or sitting outdoors at a retreat property at first light — architectural framing through a verandah or colonnade. Atmospheric, with people doing something in it. Not an empty infinity pool, not a sunset terrace.",
    ratio: "16:9",
    alt: "Folded blankets and bare feet on a wooden floor at the end of a session.",
    section: "The room",
  },
} satisfies Record<string, ImageEntry>;

export type ImageSlug = keyof typeof images;
