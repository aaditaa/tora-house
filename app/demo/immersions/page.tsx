import Image from "next/image";

import { Board, CornerCap, TabBar } from "@/components/demo/Board";
import { immersions, type Immersion } from "@/lib/demo-data";

/**
 * Treatment B on Vetiver. The reference draws these cards flat, but the
 * photographs are the point of an invitation list, so each card carries its
 * picture and the board's three grounds — Bone, a warm gradient, Sand — are
 * kept for the text beneath it.
 */
const FACES = [
  {
    card: { background: "var(--bone)" },
    date: "var(--deepbrass)",
    title: "var(--ink)",
    detail: "#6d766e",
    action: "var(--brass)",
  },
  {
    card: { background: "linear-gradient(165deg,#8e7d62,#4a4336)" },
    date: "rgba(243,238,228,.8)",
    title: "var(--bone)",
    detail: "rgba(243,238,228,.72)",
    action: "var(--sand)",
  },
  {
    card: { background: "var(--sand)" },
    date: "var(--deepbrass)",
    title: "var(--ink)",
    detail: "#5d6459",
    action: "var(--deepbrass)",
  },
] as const;

export default function ImmersionsPage() {
  const upcoming = immersions.filter((i) => i.state === "upcoming");
  const attended = immersions.filter((i) => i.state === "attended");

  return (
    <Board ground="vetiver" style={{ padding: "56px 0 0" }}>
      <div className="relative" style={{ height: 10 }}>
        <CornerCap side="left">
          <span style={{ color: "var(--sand)" }}>The invitation list</span>
        </CornerCap>
        <CornerCap side="right">
          <span style={{ color: "rgba(217,205,180,.55)" }}>
            {String(upcoming.length).padStart(2, "0")}
          </span>
        </CornerCap>
      </div>

      <div style={{ padding: "14px 20px 0" }}>
        <h1
          className="dp"
          style={{ fontSize: 27, color: "var(--bone)", lineHeight: 1.16 }}
        >
          Immersions
        </h1>
        <p
          style={{
            fontSize: 10.5,
            color: "rgba(217,205,180,.75)",
            marginTop: 6,
          }}
        >
          A few times a year, capped. Run by the people you already train with.
        </p>
      </div>

      <ul
        className="flex"
        style={{ gap: 8, padding: "18px 20px 0", listStyle: "none" }}
      >
        {upcoming.map((i, n) => (
          <Card key={i.id} immersion={i} face={FACES[n % FACES.length]!} />
        ))}
      </ul>

      <div style={{ padding: "20px 20px 0" }}>
        <div
          className="flex items-baseline justify-between"
          style={{
            borderTop: "1px solid rgba(217,205,180,.3)",
            paddingTop: 12,
          }}
        >
          <span
            className="trk"
            style={{ fontSize: 8, color: "rgba(217,205,180,.65)" }}
          >
            You have been to
          </span>
          <span className="dp" style={{ fontSize: 17, color: "var(--bone)" }}>
            {attended.length}
          </span>
        </div>

        <ul style={{ listStyle: "none" }}>
          {attended.map((i, n) => (
            <li
              key={i.id}
              className="flex items-center"
              style={{
                gap: 10,
                padding: "11px 0",
                borderBottom:
                  n === attended.length - 1
                    ? "none"
                    : "1px solid rgba(217,205,180,.15)",
              }}
            >
              <span
                className="relative overflow-hidden"
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 8,
                  flex: "0 0 34px",
                }}
              >
                <Image
                  src={i.image}
                  alt={i.alt}
                  fill
                  sizes="34px"
                  className="object-cover"
                />
              </span>
              <span style={{ flex: 1 }}>
                <span
                  className="block"
                  style={{ fontSize: 11, color: "var(--bone)" }}
                >
                  {i.title}
                </span>
                <span
                  className="block"
                  style={{
                    fontSize: 9,
                    color: "rgba(217,205,180,.55)",
                    marginTop: 2,
                  }}
                >
                  {i.when}
                </span>
              </span>
              <span
                className="trk"
                style={{ fontSize: 7.5, color: "rgba(217,205,180,.45)" }}
              >
                Went
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: "auto", padding: "0 20px 86px" }}>
        <p
          style={{
            fontSize: 9,
            color: "rgba(217,205,180,.5)",
            lineHeight: 1.5,
            paddingBottom: 12,
          }}
        >
          Places are part of your membership. Nothing here is bought.
        </p>
        <div className="flex justify-between" aria-hidden="true">
          <span
            className="trk"
            style={{ fontSize: 8, color: "rgba(217,205,180,.42)" }}
          >
            Movement
          </span>
          <span
            className="trk"
            style={{ fontSize: 8, color: "rgba(217,205,180,.42)" }}
          >
            Stillness
          </span>
          <span
            className="trk"
            style={{ fontSize: 8, color: "rgba(217,205,180,.42)" }}
          >
            The table
          </span>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}

function Card({
  immersion,
  face,
}: {
  immersion: Immersion;
  face: (typeof FACES)[number];
}) {
  return (
    <li
      className="flex flex-1 flex-col overflow-hidden"
      style={{ borderRadius: 12, minHeight: 172, ...face.card }}
    >
      <span className="relative block" style={{ height: 92, flex: "0 0 92px" }}>
        <Image
          src={immersion.image}
          alt={immersion.alt}
          fill
          sizes="(max-width: 30rem) 45vw, 160px"
          className="object-cover"
        />
      </span>

      <span className="flex flex-1 flex-col" style={{ padding: "10px 9px 11px" }}>
        <span className="trk" style={{ fontSize: 7, color: face.date }}>
          {immersion.day ? `Dec ${immersion.day}` : immersion.when}
        </span>
        <span
          className="dp block"
          style={{
            fontSize: 15,
            color: face.title,
            lineHeight: 1.1,
            marginTop: 7,
          }}
        >
          {immersion.title}
        </span>
        <span
          className="block"
          style={{
            fontSize: 8,
            color: face.detail,
            lineHeight: 1.45,
            marginTop: 6,
          }}
        >
          {immersion.detail}
        </span>
        <button
          type="button"
          className="trk text-left"
          style={{ marginTop: "auto", paddingTop: 8, fontSize: 8, color: face.action }}
        >
          Hold a place →
        </button>
      </span>
    </li>
  );
}
