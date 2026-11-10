import { notFound } from "next/navigation";

import { Board, InkBar, TabBar } from "@/components/demo/Board";
import { guide, markerGroups } from "@/lib/demo-data";

const all = markerGroups.flatMap((g) =>
  g.markers.map((m) => ({ ...m, group: g })),
);

export function generateStaticParams() {
  return all.map((m) => ({ markerId: m.id }));
}

/** 09 · Marker detail. Treatment C, Ink. */
export default async function MarkerPage({
  params,
}: {
  params: Promise<{ markerId: string }>;
}) {
  const { markerId } = await params;
  const marker = all.find((m) => m.id === markerId);
  if (!marker) notFound();

  const readings = [
    { label: "Dec", value: marker.baseline },
    { label: "Mar", value: marker.m3 },
    { label: "Jun", value: marker.m6 },
  ].filter((r) => r.value);

  const nums = readings.map((r) => parseFloat(r.value!));
  const lo = Math.min(...nums);
  const hi = Math.max(...nums);
  const span = hi - lo || 1;
  const xs = [22, 121, 220];
  const pts = nums.map(
    (n, i) => `${xs[i]},${(80 - ((n - lo) / span) * 50).toFixed(1)}`,
  );

  return (
    <Board ground="ink" style={{ padding: "52px 0 0" }}>
      <div
        className="glow"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(280px 240px at 50% 28%, rgba(169,132,72,.4), transparent 72%)",
        }}
      />

      <InkBar label="Marker" href="/demo/markers" />

      <div className="relative z-[5]" style={{ padding: "22px 20px 0" }}>
        <h1
          className="dp"
          style={{ fontSize: 26, color: "var(--bone)", lineHeight: 1.1 }}
        >
          {marker.name}
        </h1>
        <p
          style={{
            fontSize: 11,
            color: "rgba(217,205,180,.72)",
            marginTop: 8,
            lineHeight: 1.55,
          }}
        >
          {marker.plain}
        </p>
        <div className="flex" style={{ gap: 6, marginTop: 12 }}>
          {marker.unscoredNote ? (
            <span
              className="chip"
              style={{
                background: "rgba(243,238,228,.08)",
                color: "rgba(217,205,180,.8)",
                fontSize: 8,
              }}
            >
              {marker.unscoredNote}
            </span>
          ) : (
            <span
              className={`chip ${
                marker.status === "In range"
                  ? "ok"
                  : marker.status === "Low"
                    ? "low"
                    : "watch"
              }`}
              style={{ fontSize: 8 }}
            >
              {marker.status} at baseline
            </span>
          )}
          <span
            className="chip"
            style={{
              background: "rgba(243,238,228,.08)",
              color: "rgba(217,205,180,.8)",
              fontSize: 8,
            }}
          >
            Band {marker.band}
          </span>
        </div>
      </div>

      {readings.length > 1 ? (
        <div
          className="relative z-[5]"
          style={{
            margin: "20px 20px 0",
            background: "rgba(243,238,228,.05)",
            border: "1px solid rgba(243,238,228,.09)",
            borderRadius: 16,
            padding: "16px 14px 12px",
          }}
        >
          <svg
            width="100%"
            height="94"
            viewBox="0 0 242 94"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              x1="0"
              y1="26"
              x2="242"
              y2="26"
              stroke="rgba(157,191,162,.3)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            <polyline
              points={pts.join(" ")}
              fill="none"
              stroke="url(#mk)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="mk" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#7A5F2E" />
                <stop offset="1" stopColor="#E0BC7C" />
              </linearGradient>
            </defs>
            {pts.map((p, i) => {
              const [cx, cy] = p.split(",");
              return (
                <circle
                  key={p}
                  cx={cx}
                  cy={cy}
                  r="4.5"
                  fill={i === pts.length - 1 ? "#F3EEE4" : "#E0BC7C"}
                />
              );
            })}
          </svg>

          <div className="flex justify-between" style={{ marginTop: 2 }}>
            {readings.map((r) => (
              <div key={r.label} className="flex-1 text-center">
                <div
                  className="dp"
                  style={{ fontSize: 16, color: "var(--bone)" }}
                >
                  {r.value}
                </div>
                <div
                  className="cap"
                  style={{
                    fontSize: 7,
                    color: "rgba(217,205,180,.55)",
                    marginTop: 3,
                  }}
                >
                  {r.label}
                </div>
              </div>
            ))}
          </div>

          <div
            className="cap text-center"
            style={{
              fontSize: 7,
              color: "rgba(157,191,162,.75)",
              marginTop: 10,
            }}
          >
            — — the band begins here
          </div>
        </div>
      ) : null}

      <div className="relative z-[5]" style={{ padding: "18px 20px 0" }}>
        <div className="cap" style={{ color: "var(--brass)" }}>
          Which pillar moves it
        </div>
        <div className="flex flex-wrap" style={{ gap: 6, marginTop: 10 }}>
          {marker.group.movedBy.map((p) => (
            <span
              key={p}
              style={{
                border: "1px solid rgba(217,205,180,.3)",
                color: "var(--sand)",
                borderRadius: 999,
                padding: "5px 11px",
                fontSize: 9.5,
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      <div
        className="relative z-[5] mt-auto"
        style={{ padding: "18px 20px 124px" }}
      >
        <div
          className="flex items-start"
          style={{
            gap: 10,
            borderTop: "1px solid rgba(243,238,228,.1)",
            paddingTop: 13,
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 26,
              height: 26,
              borderRadius: "50%",
              background: "linear-gradient(140deg,#b9a583,#6f5c3f)",
              flex: "0 0 26px",
            }}
          />
          <p
            style={{
              fontSize: 10,
              color: "rgba(243,238,228,.72)",
              lineHeight: 1.5,
            }}
          >
            &ldquo;{marker.guideNote}&rdquo; &mdash; {guide.name.split(" ")[0]}
          </p>
        </div>
      </div>

      <TabBar />
    </Board>
  );
}
