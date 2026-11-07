import { Row, Screen } from "@/components/demo/Bits";
import { immersions } from "@/lib/demo-data";

export default function ImmersionsPage() {
  const upcoming = immersions.filter((i) => i.state === "upcoming");
  const attended = immersions.filter((i) => i.state === "attended");

  return (
    <Screen
      eyebrow="Immersions"
      title="The room, in person."
      lede="A few times a year, capped, and run by the people you already train with."
    >
      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">Upcoming</p>
        {upcoming.map((i) => (
          <div
            key={i.id}
            className="flex flex-col gap-3 border-b border-rule py-4 last:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="t-h3">{i.title}</p>
              <p className="t-eyebrow flex-none">{i.when}</p>
            </div>
            <p className="t-meta text-fg-muted">{i.detail}</p>
            <div>
              <button type="button" className="btn btn-quiet">
                Hold a place
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">You have been to</p>
        {attended.map((i) => (
          <Row key={i.id} label={i.title} sub={i.detail} value={i.when} />
        ))}
      </div>

      <p className="t-meta text-fg-muted">
        Places are part of your membership. Nothing here is bought.
      </p>
    </Screen>
  );
}
