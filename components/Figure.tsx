import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

import {
  images,
  type ImageEntry,
  type ImageSlug,
} from "@/public/images/manifest";

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
  /**
   * Fill the positioned parent instead of holding the slot's own ratio — for a frame
   * used as a ground rather than as content.
   */
  fill?: boolean;
};

/**
 * Renders the real photograph when the file is present in /public/images/, and a
 * warm --sand block carrying the subject note and ratio when it is absent. Drop
 * the file in, rebuild, and the slot fills itself.
 */
export function Figure({
  slug,
  className = "",
  priority = false,
  sizes = "100vw",
  overlaid = false,
  fill = false,
}: FigureProps) {
  // Widened so optional fields on ImageEntry are reachable for every slug.
  const entry: ImageEntry = images[slug];
  const [w, h] = entry.ratio.split(":").map(Number);
  const aspectRatio = fill ? undefined : `${w} / ${h}`;
  /**
   * A token derived from the file itself, appended to the src. Photographs get
   * replaced under the same filename, and without this a browser or a CDN will keep
   * serving the one it already has — which is a quiet way to ship the wrong picture.
   */
  let version: string | null = null;
  try {
    const stat = fs.statSync(
      path.join(process.cwd(), "public", "images", entry.file),
    );
    version = `${stat.size.toString(36)}-${Math.round(stat.mtimeMs).toString(36)}`;
  } catch {
    version = null;
  }
  const present = version !== null;

  if (!present) {
    return (
      <div
        className={`figure-empty figure-print-keep overflow-hidden ${fill ? "" : "relative"} ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
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
      className={`figure-print-keep overflow-hidden ${fill ? "" : "relative"} ${className}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      <Image
        src={`/images/${entry.file}?v=${version}`}
        alt={entry.alt}
        fill
        sizes={sizes}
        priority={priority}
        quality={88}
        loading={priority ? "eager" : "lazy"}
        className="object-cover"
        style={entry.focus ? { objectPosition: entry.focus } : undefined}
      />
    </div>
  );
}
