import { Primary, Screen } from "@/components/demo/Bits";
import { WelcomeFilm } from "@/components/demo/WelcomeFilm";

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
      <WelcomeFilm />

      <div className="flex flex-1 flex-col justify-center gap-7 py-2">
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
    </Screen>
  );
}
