import Link from "next/link";

import { Board, Hero, TabBar } from "@/components/demo/Board";
import {
  actions,
  baselineIsNotAPillar,
  pillarPreferenceNote,
  pillars,
  recoveryDetail,
  type Pillar,
} from "@/lib/demo-data";

const ROMAN = ["I", "II", "III", "IV", "V"];

/** 10 · My plan. Treatment A, h-green. Each pillar opens onto its actions. */
export default function PlanPage() {
  const ordered = [...pillars].sort((a, b) => a.preference - b.preference);

  return (
    <Board>
      <Hero
        wash="green"
        height={196}
        bar="My plan"
        cap="December · Week three"
        title={
          <>
            Five pillars,
            <br />
            <i>one plan</i>
          </>
        }
        titleSize={24}
        textTop={22}
      />

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "14px 20px 0" }}
      >
        <p
          style={{
            fontSize: 9.5,
            color: "#8d958e",
            lineHeight: 1.5,
            paddingBottom: 10,
          }}
        >
          {pillarPreferenceNote}
        </p>

        {ordered.map((pillar, i) => (
          <PillarRow key={pillar.id} pillar={pillar} numeral={ROMAN[i]!} />
        ))}

        <div className="mt-auto" style={{ paddingTop: 18, paddingBottom: 86 }}>
          <div
            style={{
              background: "rgba(217,205,180,.4)",
              borderRadius: 14,
              padding: "12px 13px",
            }}
          >
            <div className="cap" style={{ color: "var(--deepbrass)" }}>
              Underneath all five
            </div>
            <p
              style={{
                fontSize: 10.5,
                color: "#4e574f",
                marginTop: 5,
                lineHeight: 1.5,
              }}
            >
              {baselineIsNotAPillar}
            </p>
          </div>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}

function PillarRow({ pillar, numeral }: { pillar: Pillar; numeral: string }) {
  const mine = actions.filter((a) => a.pillarId === pillar.id);

  return (
    <details
      className="demo-pillar-row group"
      style={{ borderBottom: "1px solid rgba(169,132,72,.22)" }}
    >
      <summary
        className="flex cursor-pointer list-none items-center [&::-webkit-details-marker]:hidden"
        style={{ gap: 12, padding: "12px 0" }}
      >
        <span
          className="dp"
          style={{ fontSize: 12, color: "var(--brass)", width: 14 }}
        >
          {numeral}
        </span>
        <span style={{ flex: 1 }}>
          <span className="block" style={{ fontSize: 12.5, color: "var(--ink)" }}>
            {pillar.name}
          </span>
          <span
            className="block"
            style={{ fontSize: 9.5, color: "#8d958e", marginTop: 2 }}
          >
            {mine.length} actions · {pillar.holds.replace(/\.$/, "").toLowerCase()}
          </span>
        </span>
        <span
          aria-hidden="true"
          className="transition-transform duration-200 group-open:rotate-90"
          style={{ color: "#a8b0a9", fontSize: 12 }}
        >
          →
        </span>
      </summary>

      <div style={{ paddingBottom: 16 }}>
        <Block label={`Why it is number ${pillar.preference}`}>
          <p style={{ fontSize: 10.5, color: "#4e574f", lineHeight: 1.5 }}>
            {pillar.chosenBecause}
          </p>
        </Block>

        {pillar.goal ? (
          <Block label="Goal">
            <p style={{ fontSize: 10.5, color: "#4e574f", lineHeight: 1.5 }}>
              {pillar.goal}
            </p>
          </Block>
        ) : null}

        <Block label={`In your plan · ${mine.length}`}>
          <ul style={{ listStyle: "none" }}>
            {mine.map((a) => (
              <li key={a.id}>
                <Link
                  href={`/demo/plan/${a.id}`}
                  className="flex items-start justify-between"
                  style={{
                    gap: 12,
                    padding: "9px 0",
                    borderTop: "1px solid rgba(169,132,72,.18)",
                  }}
                >
                  <span style={{ flex: 1 }}>
                    <span
                      className="block"
                      style={{ fontSize: 11, color: "var(--ink)" }}
                    >
                      {a.label}
                    </span>
                    <span
                      className="block"
                      style={{ fontSize: 9, color: "#8d958e", marginTop: 2 }}
                    >
                      {a.frequency}
                    </span>
                  </span>
                  <span
                    className="trk"
                    style={{
                      flex: "0 0 auto",
                      fontSize: 7.5,
                      color: "var(--deepbrass)",
                      paddingTop: 2,
                    }}
                  >
                    {a.resource}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Block>

        {pillar.id === "recovery" ? <RecoveryDetail /> : null}
      </div>
    </details>
  );
}

/** The one pillar asked to be specific about what it will and will not do. */
function RecoveryDetail() {
  return (
    <>
      <Block label="What it holds, for your two">
        <ul style={{ listStyle: "none" }}>
          {recoveryDetail.forHer.map((e) => (
            <li
              key={e.what}
              style={{
                padding: "7px 0",
                borderTop: "1px solid rgba(169,132,72,.18)",
              }}
            >
              <span
                className="block"
                style={{ fontSize: 10.5, color: "var(--ink)" }}
              >
                {e.what}
              </span>
              <span
                className="cap block"
                style={{ color: "#8d958e", marginTop: 2 }}
              >
                {e.why}
              </span>
            </li>
          ))}
        </ul>
      </Block>

      <Block label="Already a daily habit">
        <Lines lines={recoveryDetail.inHerDay} />
      </Block>

      <Block label="What we do">
        <Lines lines={recoveryDetail.weDo} />
      </Block>

      <Block label="What we never do">
        <Lines lines={recoveryDetail.weDoNot} />
      </Block>
    </>
  );
}

function Lines({ lines }: { lines: readonly string[] }) {
  return (
    <ul className="flex flex-col" style={{ gap: 6, listStyle: "none" }}>
      {lines.map((line) => (
        <li key={line} className="flex" style={{ gap: 9 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 1,
              background: "var(--brass)",
              flex: "0 0 10px",
              marginTop: "0.55em",
            }}
          />
          <span style={{ fontSize: 10, color: "#4e574f", lineHeight: 1.5 }}>
            {line}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingTop: 12 }}>
      <div className="cap" style={{ color: "var(--deepbrass)", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}
