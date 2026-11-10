import { Board, InkBar, TabBar } from "@/components/demo/Board";
import { DownloadReport } from "@/components/demo/DownloadReport";
import {
  clinician,
  guide,
  guideParagraph,
  markerGroups,
  member,
} from "@/lib/demo-data";

/** 07 · Report. Treatment C, Ink. */
export default function ReportPage() {
  const all = markerGroups.flatMap((g) => g.markers);
  const count = (s: string) => all.filter((m) => m.status === s).length;

  const glance = [
    {
      n: count("In range"),
      label: "In range",
      tint: "rgba(126,158,130,.14)",
      ink: "#9DBFA2",
      cap: "rgba(157,191,162,.8)",
    },
    {
      n: count("Worth watching"),
      label: "Watch",
      tint: "rgba(169,132,72,.18)",
      ink: "#D9B679",
      cap: "rgba(217,182,121,.85)",
    },
    {
      n: count("Low"),
      label: "Low",
      tint: "rgba(190,120,80,.15)",
      ink: "#DFA887",
      cap: "rgba(223,168,135,.85)",
    },
  ];

  return (
    <Board ground="ink" style={{ padding: "52px 0 0" }}>
      <div className="glow" aria-hidden="true" />

      <InkBar label="Your report" href="/demo/journey" />

      <div className="relative z-[5]" style={{ padding: "22px 20px 0" }}>
        <div className="cap" style={{ color: "rgba(217,205,180,.7)" }}>
          Signed 18 December
        </div>
        <h1
          className="dp"
          style={{
            fontSize: 25,
            color: "var(--bone)",
            lineHeight: 1.14,
            marginTop: 7,
          }}
        >
          {member.name}
          <br />
          <i>baseline</i>
        </h1>
      </div>

      <div
        className="relative z-[5]"
        style={{
          margin: "18px 20px 0",
          background: "rgba(243,238,228,.05)",
          border: "1px solid rgba(243,238,228,.09)",
          borderRadius: 16,
          padding: 14,
        }}
      >
        <div className="cap" style={{ color: "var(--brass)" }}>
          What this means
        </div>
        <p
          style={{
            fontSize: 10.5,
            color: "rgba(243,238,228,.78)",
            lineHeight: 1.55,
            marginTop: 8,
          }}
        >
          {guideParagraph}
        </p>
        <div className="flex items-center" style={{ gap: 9, marginTop: 11 }}>
          <span
            aria-hidden="true"
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "linear-gradient(140deg,#b9a583,#6f5c3f)",
            }}
          />
          <span style={{ fontSize: 9.5, color: "rgba(217,205,180,.7)" }}>
            {guide.name}, your guide
          </span>
        </div>
      </div>

      <div className="relative z-[5]" style={{ padding: "16px 20px 0" }}>
        <div className="cap" style={{ color: "var(--brass)" }}>
          At a glance
        </div>
        <div className="flex" style={{ gap: 7, marginTop: 11 }}>
          {glance.map((g) => (
            <div
              key={g.label}
              className="flex-1 text-center"
              style={{
                background: g.tint,
                borderRadius: 12,
                padding: "11px 0",
              }}
            >
              <div className="dp" style={{ fontSize: 19, color: g.ink }}>
                {g.n}
              </div>
              <div
                style={{
                  fontSize: 7.5,
                  letterSpacing: ".14em",
                  color: g.cap,
                  textTransform: "uppercase",
                }}
              >
                {g.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-[5]" style={{ padding: "16px 20px 0" }}>
        <div
          className="flex items-center justify-between"
          style={{
            padding: "11px 0",
            borderTop: "1px solid rgba(243,238,228,.1)",
          }}
        >
          <span style={{ fontSize: 11.5, color: "rgba(243,238,228,.85)" }}>
            Signed by {clinician.name}
          </span>
          <span
            aria-hidden="true"
            style={{ color: "rgba(217,205,180,.5)", fontSize: 11 }}
          >
            ✓
          </span>
        </div>
      </div>

      <div
        className="relative z-[5] mt-auto"
        style={{ padding: "20px 20px 124px" }}
      >
        <DownloadReport />
        <p
          className="text-center"
          style={{
            fontSize: 8.5,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "rgba(217,205,180,.4)",
            marginTop: 10,
          }}
        >
          Sample data · Not medical advice
        </p>
      </div>

      <TabBar />
    </Board>
  );
}
