import { Lockup } from "@/components/Brand";
import { Primary, Screen } from "@/components/demo/Bits";

export default function WelcomePage() {
  return (
    <Screen
      footer={
        <div className="flex flex-col gap-3">
          <Primary href="/demo/consent">Continue</Primary>
          <p className="t-meta text-center text-fg-muted">
            I have an invitation
          </p>
        </div>
      }
    >
      <div className="flex flex-1 flex-col items-center justify-center gap-10 py-8">
        <Lockup variant="stacked" withTagline align="center" />

        <div className="flex w-full flex-col gap-7">
          <label className="flex flex-col gap-2">
            <span className="t-meta font-medium">Your name</span>
            <input className="field-input" defaultValue="Meera Rao" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="t-meta font-medium">Phone</span>
            <input
              className="field-input"
              inputMode="tel"
              defaultValue="+91 98450 00000"
            />
          </label>
        </div>
      </div>
    </Screen>
  );
}
