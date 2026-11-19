import fs from "node:fs";
import path from "node:path";

/**
 * A partner's mark, from `public/partners/<partner-name>.svg` when that file is
 * there, and a text wordmark when it is not. Dropping their supplied SVG at that
 * path is the whole of the swap; nothing else changes.
 *
 * The fallback is set in Bodoni Moda italic and does not imitate their logo. It
 * reads as a deliberate credit beside the torana, which is what makes it safe to
 * ship before their files and their written yes arrive.
 *
 * Rules for the real file, from the brief: never recoloured, stretched, rotated,
 * outlined, shadowed or boxed; clear space at least the height of its capital M;
 * never under about 110px wide, so it is drawn at a fixed 184px. It appears in
 * the immersion lockup and nowhere else.
 */
export function PartnerMark({ name }: { name: string }) {
  const file = `partners/${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.svg`;
  const exists = fs.existsSync(path.join(process.cwd(), "public", file));

  if (exists) {
    return (
      // A plain img, not next/image: an SVG gains nothing from the optimiser and
      // must not be rasterised, or the thin strokes of a script soften.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/${file}`} alt={name} className="partner-mark-file" />
    );
  }

  return <span className="partner-mark-text">{name}</span>;
}
