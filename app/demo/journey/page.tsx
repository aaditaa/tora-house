import Link from "next/link";

import { Board, Hero, TabBar } from "@/components/demo/Board";
import { guide, journeySteps, messages } from "@/lib/demo-data";

/**
 * 04 · Journey tracker. Treatment A, h-green.
 *
 * The rail is drawn the way the board draws it: a 17px column of dots joined by
 * hairlines, filled for what is done, brass for where she is, outlined for what
 * is still ahead. The order comes from journeySteps — blood first, then the
 * call — which is the house's order, not the board's caption.
 */
export default function JourneyPage() {
  const first = messages.find((m) => m.from === "guide");

  return (
    <Board>
      <Hero
        wash="green"
        height={214}
        bar="Your journey"
        cap={`Step ${journeySteps.findIndex((s) => s.state === "now") + 1} of ${journeySteps.length}`}
        title={
          <>
            We are
            <br />
            <i>listening first</i>
          </>
        }
        titleSize={25}
        textTop={28}
      />

      <div
        className="flex flex-1 flex-col"
        style={{ background: "var(--bone)", padding: "20px 22px 0" }}
      >
        <div className="flex" style={{ gap: 12 }}>
          <div
            className="flex flex-col items-center"
            style={{ width: 17, paddingTop: 3 }}
            aria-hidden="true"
          >
            {journeySteps.map((step, i) => (
              <Dot
                key={step.id}
                state={step.state}
                last={i === journeySteps.length - 1}
                nextPending={journeySteps[i + 1]?.state !== "done"}
              />
            ))}
          </div>

          <ol className="flex flex-1 flex-col" style={{ gap: 19 }}>
            {journeySteps.map((step) => {
              const ahead = step.state === "waiting";
              return (
                <li key={step.id}>
                  <Link href={step.href} className="block">
                    <span
                      className="block"
                      style={{
                        fontSize: 12.5,
                        color: ahead ? "#9aa29b" : "var(--ink)",
                      }}
                    >
                      {step.label}
                    </span>
                    <span
                      className="block"
                      style={{
                        fontSize: 10,
                        marginTop: 2,
                        color:
                          step.state === "now"
                            ? "var(--deepbrass)"
                            : ahead
                              ? "#a8b0a9"
                              : "#8d958e",
                      }}
                    >
                      {step.detail}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="mt-auto" style={{ paddingBottom: 86 }}>
          <div
            className="flex items-center"
            style={{
              background: "rgba(217,205,180,.4)",
              borderRadius: 14,
              padding: "13px 14px",
              gap: 11,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "linear-gradient(140deg,#b9a583,#6f5c3f)",
                flex: "0 0 30px",
              }}
            />
            <p
              style={{
                flex: 1,
                fontSize: 10.5,
                color: "#4e574f",
                lineHeight: 1.45,
              }}
            >
              &ldquo;{first?.text}&rdquo; &mdash; {guide.name.split(" ")[0]}
            </p>
          </div>
        </div>
      </div>

      <TabBar lt />
    </Board>
  );
}

function Dot({
  state,
  last,
  nextPending,
}: {
  state: "done" | "now" | "waiting";
  last: boolean;
  nextPending: boolean;
}) {
  const fill =
    state === "done"
      ? "var(--vetiver)"
      : state === "now"
        ? "var(--brass)"
        : "transparent";

  return (
    <>
      <span
        style={{
          width: 9,
          height: 9,
          borderRadius: "50%",
          background: fill,
          border:
            state === "waiting" ? "1px solid rgba(169,132,72,.5)" : undefined,
          flex: "0 0 auto",
        }}
      />
      {last ? null : (
        <span
          style={{
            flex: 1,
            width: 1,
            minHeight: 18,
            background: nextPending ? "rgba(169,132,72,.3)" : "var(--vetiver)",
          }}
        />
      )}
    </>
  );
}
