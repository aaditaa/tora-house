import fs from "node:fs";
import path from "node:path";

import { ImageResponse } from "next/og";

import {
  AGE_RANGE,
  BRAND_NAME,
  BRAND_TAGLINE,
  CITY,
  cohortSizeLabel,
} from "@/lib/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${BRAND_NAME} — a members' club for women ${AGE_RANGE} in ${CITY}`;

const INK = "#17211C";
const BONE = "#F3EEE4";
const BRASS = "#A98448";
const SAND = "#D9CDB4";

function font(file: string) {
  return fs.readFileSync(path.join(process.cwd(), "assets", "fonts", file));
}

export default async function OpengraphImage() {
  const display = font("BodoniModa-Regular.ttf");
  const sans = font("Jost-Regular.ttf");

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: INK,
        color: BONE,
        padding: "64px 76px",
        fontFamily: "Bodoni Moda",
      }}
    >
      {/* The lockup: torana, hairline, wordmark. */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <svg width="56" height="56" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={BONE}
            strokeWidth="1.2"
          />
          <path
            d="M50 13c3.4 5.4 3.4 9.6 0 14-3.4-4.4-3.4-8.6 0-14Z"
            fill={BONE}
          />
          <g fill="none" stroke={BONE} strokeWidth="2.6" strokeLinecap="round">
            <path d="M50 27v7" />
            <path d="M17 27q0 7 7 7h52q7 0 7-7" />
            <path d="M21 43q0 6.5 6.5 6.5h45q6.5 0 6.5-6.5" />
            <path d="M33.5 34v52" />
            <path d="M66.5 34v52" />
            <path d="M23 86h54" />
          </g>
        </svg>
        <div
          style={{
            display: "flex",
            width: 1,
            height: 44,
            backgroundColor: BRASS,
          }}
        />
        <div style={{ display: "flex", fontSize: 30, letterSpacing: "0.22em" }}>
          {BRAND_NAME.toUpperCase()}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <div
          style={{
            display: "flex",
            width: 110,
            height: 1,
            backgroundColor: BRASS,
          }}
        />
        <div
          style={{
            display: "flex",
            fontSize: 86,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          A year of practice, held for you.
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Jost",
            fontSize: 21,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: BRASS,
          }}
        >
          {BRAND_TAGLINE}
        </div>
        <div
          style={{
            display: "flex",
            fontFamily: "Jost",
            fontSize: 21,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: SAND,
          }}
        >
          {CITY} · Cohort of {cohortSizeLabel()}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Bodoni Moda", data: display, style: "normal", weight: 400 },
        { name: "Jost", data: sans, style: "normal", weight: 400 },
      ],
    },
  );
}
