import { Disclaimer, Primary, Row, Screen } from "@/components/demo/Bits";

const TERMS = [
  {
    label: "What we collect",
    sub: "Your answers to the questionnaire, your baseline panel readings, and what you tick off each day.",
  },
  {
    label: "Who sees it",
    sub: "Your guide, and the clinical practitioner who signs your report. Nobody else.",
  },
  {
    label: "How long we keep it",
    sub: "While you are a member, and for twelve months after. You can ask for it to be deleted at any point.",
  },
  {
    label: "What we never do",
    sub: "Sell it, share it for anyone else's marketing, or use it to decide anything about you without telling you.",
  },
];

export default function ConsentPage() {
  return (
    <Screen
      eyebrow="Before we begin"
      title="What you are agreeing to."
      footer={<Primary href="/demo/survey">I understand — continue</Primary>}
    >
      <div className="flex flex-col">
        {TERMS.map((t) => (
          <Row key={t.label} label={t.label} sub={t.sub} />
        ))}
      </div>

      <Disclaimer />

      <p className="t-meta text-fg-muted">
        Consent is asked for one thing at a time and is never bundled. You can
        withdraw any of it without losing the rest.
      </p>
    </Screen>
  );
}
