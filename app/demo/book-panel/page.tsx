import { Primary, Row, Screen } from "@/components/demo/Bits";
import { panelGroups, panelPrep } from "@/lib/demo-data";

export default function BookPanelPage() {
  return (
    <Screen
      eyebrow="Your baseline"
      title="The baseline panel."
      lede="Home collection, fasting. Everything after it is measured against this."
      footer={
        <Primary href="/demo/report">Book Tuesday 1 December, 7:00am</Primary>
      }
    >
      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">Where</p>
        <Row
          label="Home collection"
          sub="A phlebotomist comes to you. Indiranagar is covered."
          value="Selected"
        />
        <Row label="At the centre" sub="Indiranagar, 40 minutes." />
      </div>

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">What it covers</p>
        {panelGroups.map((g) => (
          <Row key={g.id} label={g.system} value={`${g.count} markers`} />
        ))}
        <Row
          label="Functional measures"
          sub="Taken with Ananya in the room, not in the lab."
          value="6 measures"
        />
      </div>

      <div className="flex flex-col gap-3 bg-sand p-5">
        <p className="t-eyebrow">How to prepare</p>
        <p className="t-meta text-fg-muted">{panelPrep}</p>
      </div>
    </Screen>
  );
}
