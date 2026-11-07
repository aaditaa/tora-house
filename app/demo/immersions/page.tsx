import Image from "next/image";

import { Screen } from "@/components/demo/Bits";
import { immersions, type Immersion } from "@/lib/demo-data";

export default function ImmersionsPage() {
  const upcoming = immersions.filter((i) => i.state === "upcoming");
  const attended = immersions.filter((i) => i.state === "attended");

  return (
    <Screen
      eyebrow="Immersions"
      title="The room, in person."
      lede="A few times a year, capped. Run by the people you already train with."
    >
      <section className="flex flex-col gap-4">
        <p className="t-eyebrow">Upcoming</p>
        {upcoming.map((i) => (
          <Card key={i.id} immersion={i} />
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <p className="t-eyebrow">You have been to</p>
        {attended.map((i) => (
          <Card key={i.id} immersion={i} past />
        ))}
      </section>

      <p className="t-meta text-fg-muted">
        Places are part of your membership. Nothing here is bought.
      </p>
    </Screen>
  );
}

function Card({
  immersion,
  past = false,
}: {
  immersion: Immersion;
  past?: boolean;
}) {
  return (
    <article className="demo-immersion">
      <div className="demo-immersion-figure">
        <Image
          src={immersion.image}
          alt={immersion.alt}
          fill
          sizes="(max-width: 30rem) 100vw, 340px"
          className={`object-cover ${past ? "demo-immersion-past" : ""}`}
        />
        <span className="demo-immersion-tag">
          {past ? "Attended" : immersion.when}
        </span>
      </div>

      <div className="flex flex-col gap-2.5 px-4 pt-3.5 pb-4">
        <p className="t-h3">{immersion.title}</p>
        <p className="t-meta text-fg-muted">{immersion.detail}</p>
        {past ? (
          <p className="t-eyebrow">{immersion.when}</p>
        ) : (
          <div className="pt-1">
            <button type="button" className="btn btn-quiet min-h-0 py-3">
              Hold a place
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
