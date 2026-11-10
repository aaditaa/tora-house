import Link from "next/link";
import { notFound } from "next/navigation";

import { Board, TabBar } from "@/components/demo/Board";
import { actionById, actions, guide, pillars } from "@/lib/demo-data";

export function generateStaticParams() {
  return actions.map((a) => ({ actionId: a.id }));
}

/** 11 · Action detail. Treatment A, h-stone. */
export default async function ActionPage({
  params,
}: {
  params: Promise<{ actionId: string }>;
}) {
  const { actionId } = await params;
  const action = actionById(actionId);
  if (!action) notFound();

  const pillar = pillars.find((p) => p.id === action.pillarId)!;
  const siblings = actions.filter((a) => a.pillarId === action.pillarId);
  const index = siblings.findIndex((a) => a.id === action.id) + 1;
  const player = action.resource === "Video" || action.resource === "Audio";

  return (
    <Board>
      <div className="hero h-stone relative" style={{ height: 232 }}>
        <div className="hbar">
          <Link
            href="/demo/plan"
            aria-label="Back to the plan"
            style={{ color: "rgba(243,238,228,.8)", fontSize: 13 }}
          >
            ←
          </Link>
          <span className="cap" style={{ color: "rgba(243,238,228,.82)" }}>
            {pillar.name} · Action {index} of {siblings.length}
          </span>
          <span className="av" aria-hidden="true" />
        </div>

        {player ? (
          <div
            className="relative z-[3] flex items-center justify-center"
            style={{ marginTop: 18 }}
          >
            <span
              style={{
                width: 50,
                height: 50,
                borderRadius: "50%",
                background: "rgba(243,238,228,.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: "14px solid var(--ink)",
                  borderTop: "9px solid transparent",
                  borderBottom: "9px solid transparent",
                  marginLeft: 4,
                }}
              />
            </span>
          </div>
        ) : null}

        <div className="htxt" style={{ marginTop: player ? 14 : 34 }}>
          <h1 className="d" style={{ fontSize: 19 }}>
            {action.label}
          </h1>
          <div
            className="cap"
            style={{ color: "rgba(217,205,180,.85)", marginTop: 7 }}
          >
            {action.resource}
          </div>
        </div>
      </div>

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "16px 20px 0" }}
      >
        <div className="flex" style={{ gap: 8 }}>
          {[
            { cap: "How often", value: action.frequency },
            { cap: "Pillar", value: pillar.name },
          ].map((box) => (
            <div
              key={box.cap}
              className="flex-1"
              style={{
                border: "1px solid rgba(169,132,72,.3)",
                borderRadius: 11,
                padding: "9px 10px",
              }}
            >
              <div
                className="cap"
                style={{ color: "var(--deepbrass)", fontSize: 7.5 }}
              >
                {box.cap}
              </div>
              <div style={{ fontSize: 11, color: "var(--ink)", marginTop: 3 }}>
                {box.value}
              </div>
            </div>
          ))}
        </div>

        <div
          className="cap"
          style={{ color: "var(--deepbrass)", marginTop: 16 }}
        >
          What to do
        </div>
        <p className="body" style={{ color: "#4e574f", marginTop: 7 }}>
          {action.note}
        </p>

        <div
          className="cap"
          style={{ color: "var(--deepbrass)", marginTop: 14 }}
        >
          Why it&rsquo;s here
        </div>
        <p className="body" style={{ color: "#4e574f", marginTop: 7 }}>
          {pillar.chosenBecause}
        </p>

        <div
          className="flex items-center"
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid rgba(169,132,72,.25)",
            gap: 9,
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
          <p style={{ fontSize: 10, color: "#6b746c", lineHeight: 1.45 }}>
            &ldquo;If a day is bad, do five. Don&rsquo;t skip it.&rdquo; &mdash;{" "}
            {guide.name.split(" ")[0]}
          </p>
        </div>

        <div className="mt-auto flex" style={{ paddingBottom: 86, gap: 9 }}>
          <button
            type="button"
            className="btn ghost"
            style={{ flex: "0 0 96px" }}
          >
            Not today
          </button>
          <button type="button" className="btn ink" style={{ flex: 1 }}>
            Mark as done
          </button>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}
