import { Portrait, Primary, Row, Screen } from "@/components/demo/Bits";
import { guide } from "@/lib/demo-data";

const SLOTS = [
  { day: "Thursday 26 November", time: "9:30am" },
  { day: "Friday 27 November", time: "4:00pm" },
  { day: "Monday 30 November", time: "7:30am" },
];

export default function BookCallPage() {
  return (
    <Screen
      eyebrow="Your 1:1"
      title="Thirty minutes with Ananya."
      footer={<Primary href="/demo/book-panel">Hold Thursday, 9:30am</Primary>}
    >
      <div className="flex items-center gap-4">
        <Portrait
          initials={guide.initials}
          size={64}
          label={`${guide.name}, placeholder portrait`}
        />
        <div className="flex flex-col gap-1">
          <p className="t-h3">{guide.name}</p>
          <p className="t-eyebrow">{guide.role}</p>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {guide.credentials.map((c) => (
          <li key={c} className="t-meta text-fg-muted">
            {c}
          </li>
        ))}
      </ul>

      <div className="flex flex-col">
        <p className="t-eyebrow pb-2">Open slots</p>
        {SLOTS.map((s) => (
          <Row key={s.day} label={s.day} value={s.time} />
        ))}
      </div>

      <p className="t-meta text-fg-muted">
        She will have read your questionnaire before you speak. The call is not
        a sales call and there is nothing to decide on it.
      </p>
    </Screen>
  );
}
