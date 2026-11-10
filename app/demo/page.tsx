import Link from "next/link";

import { Board, CornerCap } from "@/components/demo/Board";
import { WelcomeFilm } from "@/components/demo/WelcomeFilm";

/**
 * 01 · Welcome & sign-in. Treatment B, Bone, with the cover film carrying the
 * lockup — the mark and the tagline live on the film, so the Bone below it
 * holds only the greeting and the two fields.
 */
export default function WelcomePage() {
  return (
    <Board ground="bone" style={{ padding: "56px 0 0" }}>
      <div className="relative" style={{ height: 22 }}>
        <CornerCap side="left">Bengaluru</CornerCap>
        <CornerCap side="right">Est. 2026</CornerCap>
      </div>

      <WelcomeFilm className="demo-film-board" />

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-5">
        <h1
          className="dp text-center"
          style={{ fontSize: 27, lineHeight: 1.22, color: "var(--ink)" }}
        >
          Welcome
          <br />
          <i>to the room</i>
        </h1>

        <p
          className="text-center"
          style={{
            fontSize: 11,
            color: "#5d665f",
            marginTop: 11,
            lineHeight: 1.6,
            maxWidth: 215,
          }}
        >
          Your year begins with one evening and a baseline. Everything after
          that is written for you.
        </p>
      </div>

      <div style={{ padding: "0 24px 26px" }}>
        <label
          className="block"
          style={{
            borderBottom: "1px solid rgba(169,132,72,.35)",
            paddingBottom: 9,
            marginBottom: 13,
          }}
        >
          <span className="cap block" style={{ color: "var(--deepbrass)" }}>
            Your name
          </span>
          <input
            defaultValue="Meera Rao"
            className="w-full bg-transparent outline-none"
            style={{ fontSize: 12.5, color: "var(--ink)", marginTop: 4 }}
          />
        </label>

        <label
          className="block"
          style={{
            borderBottom: "1px solid rgba(169,132,72,.35)",
            paddingBottom: 9,
            marginBottom: 18,
          }}
        >
          <span className="cap block" style={{ color: "var(--deepbrass)" }}>
            Mobile
          </span>
          <input
            inputMode="tel"
            placeholder="+91"
            className="w-full bg-transparent outline-none placeholder:text-[#9aa29b]"
            style={{ fontSize: 12.5, color: "var(--ink)", marginTop: 4 }}
          />
        </label>

        <Link href="/demo/consent" className="btn ink">
          Begin
        </Link>
        <p
          className="text-center"
          style={{ fontSize: 10, color: "#7b847c", marginTop: 12 }}
        >
          I have an invitation
        </p>
      </div>
    </Board>
  );
}
