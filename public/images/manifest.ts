/**
 * The image system. The site ships without photography; every slot below renders
 * as a warm --linen block carrying its subject note and ratio until the real file
 * is dropped into /public/images/ under the filename given here. No rebuild of the
 * markup is needed — only a rebuild of the app.
 *
 * The six slots are currently filled with the stand-in photography supplied with
 * the brand assets. The subject notes below remain the commissioning brief for the
 * real shoot; casting and art direction are a hard requirement, not a preference,
 * and are set out in PLACEHOLDERS.md.
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
      "Wide, atmospheric. A woman in her fifties in a warm interior shot through a doorway or column, low-angle golden light, half in shadow, placed off-centre with negative space on the left for type. Linen, raw wood, unbleached cotton in frame. No gym equipment, no visible branding.",
    ratio: "3:2",
    alt: "A woman with her eyes lowered, water beading on her shoulder in warm low light.",
    section: "Hero",
    focus: "center 35%",
  },
  baseline: {
    file: "baseline.jpg",
    subject:
      "Close and quiet. Hands and a printed panel of results on a wooden table beside a cup, soft diffused window light. A woman in her fifties partly in frame, face turned away. Reads as a consultation, not a clinic.",
    ratio: "4:5",
    alt: "Water beaded across a shoulder and the strap of a swimsuit, close and still.",
    section: "It starts with facts",
  },
  practice: {
    file: "practice.jpg",
    subject:
      "Close and quiet. A woman of about fifty-five mid-movement rather than holding a pose — let the limbs blur slightly. Sage wall, terracotta floor, soft diffused light. Grey hair visible. No posed asana.",
    ratio: "4:5",
    alt: "A woman with grey hair reaching both arms overhead, eyes closed, against an open sky.",
    section: "The method",
  },
  room: {
    file: "room.jpg",
    subject:
      "Wide and atmospheric. Six to eight women between forty and sixty in a warm room after a session, talking, some seated on the floor. Real bodies, grey hair present, Indian women predominantly, shot in an Indian space. Golden low-angle light. Type will be overlaid lower-left, so keep that quarter of the frame quiet.",
    ratio: "3:2",
    alt: "Two women seated on the floor, one holding the other\u2019s hand across a folded blanket.",
    section: "The room",
    focus: "center 72%",
  },
  guide: {
    file: "guide.jpg",
    subject:
      "Portrait of the named lead guide. Soft window light, warm neutral ground, shoulders square to camera, no studio white. Shot in the space where the practice actually happens.",
    ratio: "1:1",
    alt: "A close portrait of an older woman\u2019s eye and brow, the lines of her face unretouched.",
    section: "The method",
  },
  retreat: {
    file: "retreat.jpg",
    subject:
      "Wide. A small group walking or sitting outdoors at a retreat property at first light — architectural framing through a verandah or colonnade. Atmospheric, with people doing something in it. Not an empty infinity pool, not a sunset terrace.",
    ratio: "16:9",
    alt: "Yellow petals resting on skin in soft, low light.",
    section: "The room",
  },
} satisfies Record<string, ImageEntry>;

export type ImageSlug = keyof typeof images;
