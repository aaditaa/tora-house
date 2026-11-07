import Link from "next/link";

import { Row, Screen } from "@/components/demo/Bits";
import { followUp, missedRules, teamMembers } from "@/lib/demo-data";

export default function TeamPage() {
  const flagged = teamMembers.filter((m) => m.flag);

  return (
    <Screen
      eyebrow="Internal"
      title="Team view."
      lede="Not part of her app. Where each woman is, and who has gone quiet."
      footer={
        <Link href="/demo/today" className="btn btn-quiet w-full">
          Back to the member view
        </Link>
      }
    >
      {flagged.length > 0 ? (
        <div className="flex flex-col gap-3 bg-sand p-5">
          <p className="t-eyebrow">Needs someone today</p>
          <ul className="flex flex-col gap-2">
            {flagged.map((m) => (
              <li key={m.id} className="t-meta">
                <span className="font-medium">{m.name}</span> — {m.flag}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">All members</p>
        {teamMembers.map((m) => (
          <Row
            key={m.id}
            label={m.name}
            sub={`${m.age} · ${m.stage}`}
            value={m.flag ? "Flagged" : ""}
          />
        ))}
      </div>

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">The rhythm</p>
        {followUp.map((f) => (
          <Row key={f.when} label={f.when} sub={f.what} value={f.who} />
        ))}
      </div>

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">If she stops showing up</p>
        {missedRules.map((r) => (
          <Row key={r.trigger} label={r.trigger} sub={r.what} value={r.who} />
        ))}
      </div>
    </Screen>
  );
}
