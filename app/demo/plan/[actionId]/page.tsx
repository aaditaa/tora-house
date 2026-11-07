import Link from "next/link";
import { notFound } from "next/navigation";

import { ResourceBlock, Row, Screen } from "@/components/demo/Bits";
import { actionById, actions, markerGroups, pillars } from "@/lib/demo-data";

export function generateStaticParams() {
  return actions.map((a) => ({ actionId: a.id }));
}

export default async function ActionPage({
  params,
}: {
  params: Promise<{ actionId: string }>;
}) {
  const { actionId } = await params;
  const action = actionById(actionId);
  if (!action) notFound();

  const pillar = pillars.find((p) => p.id === action.pillarId)!;
  // Why this action is in her plan: the groups this pillar is listed as moving.
  const moves = markerGroups.filter((g) => g.movedBy.includes(pillar.id));

  return (
    <Screen
      eyebrow={pillar.name}
      title={action.label}
      footer={
        <Link href="/demo/plan" className="btn btn-quiet w-full">
          Back to the plan
        </Link>
      }
    >
      <div className="flex flex-col">
        <Row label="How often" value={action.frequency} />
        <Row label="Resource" value={action.resource} />
      </div>

      <div className="flex flex-col gap-3">
        <p className="t-eyebrow">How to do it</p>
        <p className="t-body">{action.note}</p>
      </div>

      <ResourceBlock type={action.resource} label={action.label} />

      {moves.length > 0 ? (
        <div className="flex flex-col gap-3">
          <p className="t-eyebrow">Why it is in your plan</p>
          <p className="t-body text-fg-muted">
            {pillar.name} is one of the things that moves{" "}
            {moves.map((g) => g.system.toLowerCase()).join(", ")}. You can see
            those readings on your markers screen.
          </p>
          <Link href="/demo/markers" className="t-meta link">
            Markers over time
          </Link>
        </div>
      ) : null}
    </Screen>
  );
}
