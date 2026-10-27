import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import { images, type ImageSlug } from "@/public/images/manifest";

type FigureProps = {
  slug: ImageSlug;
  className?: string;
  /** Only the hero should load eagerly. */
  priority?: boolean;
  sizes?: string;
  /**
   * True when text is laid over this figure. The placeholder then keeps its notes in
   * the top of the frame so they do not collide with the overlaid copy.
   */
  overlaid?: boolean;
};

/**
 * Renders the real photograph when the file is present in /public/images/, and a
 * warm --linen block carrying the subject note and ratio when it is absent. Drop
 * the file in, rebuild, and the slot fills itself.
 */
export function Figure({
  slug,
  className = "",
  priority = false,
  sizes = "100vw",
  overlaid = false,
}: FigureProps) {
  const entry = images[slug];
  const [w, h] = entry.ratio.split(":").map(Number);
  const aspectRatio = `${w} / ${h}`;
  const present = fs.existsSync(path.join(process.cwd(), "public", "images", entry.file));

  if (!present) {
    return (
      <div
        className={`figure-empty figure-print-keep relative overflow-hidden ${className}`}
        style={{ aspectRatio }}
        role="img"
        aria-label={entry.alt}
      >
        <div
          className={`absolute inset-0 flex flex-col gap-5 p-6 sm:p-8 ${
            overlaid ? "justify-start" : "justify-between gap-6"
          }`}
        >
          <p className="t-eyebrow">
            {entry.section} · {entry.ratio}
          </p>
          <p className="t-meta max-w-[46ch] text-fg-muted">{entry.subject}</p>
          <p className="t-eyebrow">/public/images/{entry.file}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`figure-print-keep relative overflow-hidden ${className}`}
      style={{ aspectRatio }}
    >
      <Image
        src={`/images/${entry.file}`}
        alt={entry.alt}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
      />
    </div>
  );
}
