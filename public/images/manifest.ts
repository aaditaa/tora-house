/**
 * The image system. Each slot renders at its stated ratio; drop a correctly named
 * file into /public/images/ at that ratio and rebuild, and the slot fills itself.
 *
 * Four slots, not six. The stand-in photography supplied with the brand assets is a
 * set of close detail shots, and two of them were macros of skin that read as a brown
 * field at any size — so those slots were removed rather than filled badly. Each crop
 * below now takes as close to the whole source frame as the headline type another
 * brand had set over it allows; the room image is the complete photograph, uncropped.
 *
 * The subject notes remain the commissioning brief for the real shoot. Casting and
 * art direction are a hard requirement, not a preference, and are set out in
 * PLACEHOLDERS.md.
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
      "Wide and atmospheric, with air around the figure. A woman in her fifties in a warm interior shot through a doorway or column, low-angle golden light, half in shadow, placed off-centre. Linen, raw wood, unbleached cotton in frame. No gym equipment, no visible branding.",
    ratio: "3:2",
    alt: "A woman with grey hair reaching both arms overhead, eyes closed, against an open sky.",
    section: "Hero",
  },
  baseline: {
    file: "baseline.jpg",
    subject:
      "Close and quiet. Hands and a printed panel of results on a wooden table beside a cup, soft diffused window light. A woman in her fifties partly in frame, face turned away. Reads as a consultation, not a clinic.",
    ratio: "4:5",
    alt: "A woman with her eyes lowered, water beading across her shoulder in warm low light.",
    section: "It starts with facts",
  },
  generations: {
    file: "generations.jpg",
    subject:
      "A wide band, two women of different decades close together and looking into the lens. Grey hair present and not hidden, lines unretouched. Indian women, shot in an Indian space, warm diffused light.",
    ratio: "2:1",
    alt: "Two women side by side, one older and one younger, looking into the lens.",
    section: "The method",
  },
  room: {
    file: "room.jpg",
    subject:
      "Six to eight women between forty and sixty in a warm room after a session, talking, some seated on the floor. Real bodies, grey hair present, Indian women predominantly, shot in an Indian space. Golden low-angle light. Shot upright so the whole room is in frame, not a slice of it.",
    ratio: "2:3",
    alt: "Two women seated on the floor of a quiet room, one holding the other's hand across a folded blanket.",
    section: "The room",
  },
} satisfies Record<string, ImageEntry>;

export type ImageSlug = keyof typeof images;
