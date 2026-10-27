import { Reveal } from "@/components/Reveal";

const ITEMS = [
  {
    eyebrow: "Coordination",
    title: "Booking, scheduling, follow-ups",
    body: "Panel renewals, retreat logistics and practitioner coordination are run for you. You are told where to be and when, and the chasing happens somewhere you cannot see it.",
  },
  {
    eyebrow: "One-to-one",
    title: "A roster that has already been checked",
    body: "Physiotherapy, nutrition, Ayurvedic consultation and allied practitioners, contracted and vetted before they reach you. You are not auditioning anyone.",
  },
  {
    eyebrow: "Visiting teachers",
    title: "Brought to you, not travelled to",
    body: "Teachers worth sitting with are brought in for limited-seat sessions, rather than becoming another trip you have to plan around a quarter you have already filled.",
  },
];

/**
 * The concierge group, framed as relief rather than as features.
 */
export function Concierge() {
  return (
    <section className="on-sand section bg-surface">
      <div className="shell flex flex-col gap-16">
        <Reveal className="flex flex-col gap-6">
          <hr className="rule-brass" />
          <p className="t-eyebrow">Everything else</p>
          <h2 className="t-h2">
            Stop <span className="em-serif">managing</span> it.
          </h2>
          <p className="t-lede">
            At your income the scarce thing is not money. It is not having to
            run things.
          </p>
        </Reveal>

        <div className="grid-12">
          {ITEMS.map((item, i) => (
            <Reveal
              key={item.title}
              className="col-span-12 flex flex-col gap-4 md:col-span-6 lg:col-span-4"
              delay={i * 80}
            >
              <hr className="rule" />
              <p className="t-eyebrow pt-1">{item.eyebrow}</p>
              <h3 className="t-h3">{item.title}</h3>
              <p className="t-body">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
