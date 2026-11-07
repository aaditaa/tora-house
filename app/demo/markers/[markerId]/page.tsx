import Link from "next/link";
import { notFound } from "next/navigation";

import { Row, Screen, StatusChip } from "@/components/demo/Bits";
import { allMarkers, guide, markerById, pillars } from "@/lib/demo-data";

export function generateStaticParams() {
  return allMarkers.map((m) => ({ markerId: m.id }));
}

export default async function MarkerPage({
  params,
}: {
  params: Promise<{ markerId: string }>;
}) {
  const { markerId } = await params;
  const found = markerById(markerId);
  if (!found) notFound();
  const { marker, group } = found;

  return (
    <Screen
      eyebrow={group.system}
      title={marker.name}
      lede={marker.plain}
      footer={
        <Link href="/demo/markers" className="btn btn-quiet w-full">
          Back to your readings
        </Link>
      }
    >
      <div className="flex items-center justify-between gap-3">
        <span className="t-numeral">{marker.baseline}</span>
        <StatusChip status={marker.status} />
      </div>

      {marker.unscoredNote ? (
        <p className="t-meta text-fg-muted">{marker.unscoredNote}</p>
      ) : null}

      <div className="flex flex-col">
        <Row label="Band we read against" value={marker.band} />
        <Row label="Baseline · December" value={marker.baseline} />
        <Row
          label="Month 3 · March"
          value={marker.measuredOnce ? "Read once" : (marker.m3 ?? "Not yet")}
        />
        <Row
          label="Month 6 · June"
          value={marker.measuredOnce ? "Read once" : (marker.m6 ?? "Not yet")}
        />
      </div>

      {group.movedBy.length > 0 ? (
        <div className="flex flex-col gap-2">
          <p className="t-eyebrow">What moves it</p>
          <p className="t-body">
            {group.movedBy
              .map((id) => pillars.find((p) => p.id === id)?.name)
              .join(", ")}
            .
          </p>
        </div>
      ) : null}

      <div className="flex flex-col gap-2 bg-sand p-5">
        <p className="t-eyebrow">{guide.name}</p>
        <p className="t-meta">{marker.guideNote}</p>
      </div>

      <p className="t-meta text-fg-muted">
        A reading is not a verdict. Everything here is read with you, never used
        to tell you what is wrong with you.
      </p>
    </Screen>
  );
}
