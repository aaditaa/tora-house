"use client";

import Link from "next/link";
import { useState } from "react";

import { Board, Hero } from "@/components/demo/Board";
import { guide, guideTopics } from "@/lib/demo-data";

/**
 * 03 · Survey. Treatment A, h-warm.
 *
 * Dressed in the reference board's clothes — the warm wash, the tracked caps,
 * the pill chips, the hairline progress rule across the foot of the header.
 * The content model is unchanged: these 26 questions are asked by her guide on
 * the call, so the screen moves through the areas that call covers rather than
 * collecting typed answers. PORT.md is presentation only, so the logic stays.
 */
export default function SurveyPage() {
  const [i, setI] = useState(0);
  const topic = guideTopics[i]!;
  const last = i === guideTopics.length - 1;

  return (
    <Board>
      <Hero
        wash="warm"
        height={238}
        bar={`Area ${i + 1} of ${guideTopics.length}`}
        cap={topic.section}
        title={topic.covers}
        titleSize={21}
        progress={(i + 1) / guideTopics.length}
      />

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "18px 20px 0" }}
      >
        <div className="cap" style={{ color: "var(--deepbrass)" }}>
          What she asks here
        </div>

        <div className="flex flex-wrap" style={{ gap: 7, marginTop: 13 }}>
          {topic.examples.map((q) => (
            <span
              key={q}
              style={{
                border: "1px solid rgba(169,132,72,.4)",
                borderRadius: 999,
                padding: "7px 13px",
                fontSize: 11,
                color: "#5d665f",
              }}
            >
              {q}
            </span>
          ))}
        </div>

        <div
          style={{
            marginTop: 20,
            paddingTop: 15,
            borderTop: "1px solid rgba(169,132,72,.25)",
          }}
        >
          <div className="cap" style={{ color: "var(--deepbrass)" }}>
            {guide.name} will read this before your call
          </div>
        </div>

        <div
          className="mt-auto flex items-center"
          style={{ paddingBottom: 22, gap: 10 }}
        >
          <button
            type="button"
            onClick={() => setI((n) => Math.max(0, n - 1))}
            disabled={i === 0}
            style={{
              width: 44,
              textAlign: "center",
              fontSize: 11,
              color: "#8d958e",
              opacity: i === 0 ? 0.4 : 1,
            }}
          >
            Back
          </button>

          {last ? (
            <Link href="/demo/journey" className="btn ink flex-1">
              Next
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setI((n) => n + 1)}
              className="btn ink flex-1"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </Board>
  );
}
