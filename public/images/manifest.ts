/**
 * The image system. Each slot renders at its stated ratio; drop a correctly named
 * file into /public/images/ at that ratio and rebuild, and the slot fills itself.
 *
 * Every slot now holds a whole source frame rather than a crop of one. Four of the
 * five stand-ins carried another brand's campaign line across them; that type was
 * painted out, which is what made using the complete frames possible. The removal is
 * recorded in PLACEHOLDERS.md, and it does not make any of these photographs ours —
 * they are stand-ins and still have to be licensed or replaced.
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
  /**
   * Compression for this slot, 1\u2013100. Defaults to 88, which is right for a frame
   * someone looks at. A frame used as a ground under a scrim is not looked at, and
   * carrying portrait-grade compression for it is the most expensive byte on the
   * page — so the slot that is a ground says so here, next to the note explaining
   * why it is one.
   */
  quality?: number;
};

export const images = {
  cover: {
    file: "cover.jpg",
    subject:
      "A ground, not a scene. A deep green wall with real surface to it, meeting a pale stone ledge low in the frame. Shot upright so it holds on a phone; the type sits over the wall, so keep the upper two thirds quiet.",
    ratio: "9:16",
    alt: "",
    section: "Cover",
    focus: "center 75%",
    quality: 65,
  },
  hero: {
    file: "hero.jpg",
    subject:
      "Wide, with air around the figure. A woman in her fifties in a warm interior shot through a doorway or column, low-angle golden light, half in shadow, placed off-centre. Linen, raw wood, unbleached cotton in frame. No gym equipment, no visible branding.",
    ratio: "4:5",
    alt: "A woman with grey hair reaching both arms overhead, eyes closed, against an open sky.",
    section: "Hero",
  },
  baseline: {
    file: "baseline.jpg",
    subject:
      "Close and quiet. Hands and a printed panel of results on a wooden table beside a cup, soft diffused window light. A woman in her fifties partly in frame, face turned away. Reads as a consultation, not a clinic.",
    ratio: "5:8",
    alt: "Pale petals overlapping and lit from behind, their veins showing through.",
    section: "It starts with facts",
  },
  practice: {
    file: "practice.jpg",
    subject:
      "A woman of about fifty-five mid-movement rather than holding a pose — let the limbs blur slightly. Sage wall, terracotta floor, soft diffused light. Grey hair visible. No posed asana.",
    ratio: "2:3",
    alt: "A woman with her eyes lowered, water beading across her shoulder in warm low light.",
    section: "The method",
  },
  generations: {
    file: "generations.jpg",
    subject:
      "Two women of different decades close together, both whole faces in frame, looking into the lens. Lines and marks unretouched, grey hair present and not hidden. Indian women, shot in an Indian space, warm diffused light.",
    ratio: "8:7",
    alt: "Two women side by side, one in later life and one younger, both looking into the lens.",
    section: "The method",
  },
  strength: {
    file: "strength.webp",
    subject:
      "A woman of about fifty setting down or lifting a kettlebell in a warm wooden studio, mid-movement rather than posed. Loaded work, shown as ordinary. Grey hair visible, real body, Indian woman in an Indian space.",
    ratio: "2:3",
    alt: "A woman setting a kettlebell down on a mat in a warm wooden studio.",
    section: "The method, one curriculum",
  },
  sound: {
    file: "sound.webp",
    subject:
      "A room prepared before anyone arrives \u2014 the work already done for her. Brass singing bowls set out in a circle on a quiet floor, long light through sheer curtains. No people in frame; the point is that the arranging happened without her.",
    ratio: "2:3",
    alt: "Brass singing bowls set out in a circle on the floor of a quiet room, light coming through sheer curtains.",
    section: "One guide",
  },
  chapter: {
    file: "chapter.webp",
    subject:
      "Four to six women between forty and sixty walking together after a session, seen from behind or in profile. Indian women, shot in an Indian space. Golden low-angle light. Ease rather than exercise \u2014 this is the room, not the training.",
    ratio: "3:4",
    alt: "Four women walking away together along a tree-lined path in low autumn light.",
    section: "The room",
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
