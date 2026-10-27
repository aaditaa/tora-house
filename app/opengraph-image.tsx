import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import { AGE_RANGE, BRAND_NAME, CITY, cohortSizeLabel } from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND_NAME} — a members' club for women ${AGE_RANGE} in ${CITY}`;

export default async function OpengraphImage() {
  const display = fs.readFileSync(
    path.join(process.cwd(), "assets", "fonts", "InstrumentSerif-Regular.ttf"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#3A2E26",
          color: "#F7F3ED",
          padding: "72px 80px",
          fontFamily: "Instrument Serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#C9BDAE",
          }}
        >
          {BRAND_NAME}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", width: 120, height: 1, backgroundColor: "#B9955F" }} />
          <div style={{ display: "flex", fontSize: 92, lineHeight: 1.04, letterSpacing: "-0.02em" }}>
            A year of practice, held for you.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#B9955F",
          }}
        >
          {CITY} · Founding cohort of {cohortSizeLabel()}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Instrument Serif", data: display, style: "normal", weight: 400 }],
    },
  );
}
