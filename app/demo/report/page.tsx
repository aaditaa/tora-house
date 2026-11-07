import Link from "next/link";

import { Disclaimer, Screen, StatusChip } from "@/components/demo/Bits";
import { DownloadReport } from "@/components/demo/DownloadReport";
import { guide, guideParagraph, markerGroups, member } from "@/lib/demo-data";

export default function ReportPage() {
  const watch = markerGroups
    .flatMap((g) => g.markers)
    .filter((m) => m.status === "Worth watching" || m.status === "Low");

  return (
    <Screen
      eyebrow="Your report"
      title="Your baseline."
      lede={`Read with ${guide.name}, signed by the clinical practitioner.`}
      footer={<DownloadReport />}
    >
      <div className="flex flex-col gap-3 bg-sand p-5">
        <p className="t-eyebrow">The short version</p>
        <p className="t-meta">
          {watch.length} of {markerGroups.flatMap((g) => g.markers).length}{" "}
          readings are worth our attention. Nothing here needs a doctor today.
        </p>
      </div>

      {markerGroups.map((group) => (
        <section key={group.id} className="flex flex-col gap-3">
          <hr className="rule-brass" />
          <h2 className="t-eyebrow">{group.system}</h2>

          <div className="flex flex-col border-t border-rule">
            {group.markers.map((m) => (
              <Link
                key={m.id}
                href={`/demo/markers/${m.id}`}
                className="flex flex-col gap-1.5 border-b border-rule py-3"
              >
                <span className="flex items-baseline justify-between gap-3">
                  <span className="t-body">{m.name}</span>
                  <span className="t-meta flex-none">{m.baseline}</span>
                </span>
                <span className="flex items-center justify-between gap-3">
                  <span className="t-eyebrow text-[0.5625rem]">
                    Band {m.band}
                  </span>
                  <StatusChip status={m.status} />
                </span>
              </Link>
            ))}
          </div>

          <p className="t-meta text-fg-muted">{group.tells}</p>
        </section>
      ))}

      <div className="flex flex-col gap-3">
        <hr className="rule-brass" />
        <p className="t-eyebrow">What this means for you</p>
        <p className="t-body">{guideParagraph}</p>
        <p className="t-eyebrow">— {guide.name}</p>
      </div>

      <Disclaimer />

      <p className="demo-stamp">
        Sample data · every reading on this page is invented for the demo ·{" "}
        {member.name} is not a real member
      </p>
    </Screen>
  );
}
