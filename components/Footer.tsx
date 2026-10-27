import Link from "next/link";

import { Lockup } from "@/components/Brand";
import { ContactEmail } from "@/components/ContactEmail";
import {
  AGE_RANGE,
  BRAND_NAME,
  CITY,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  SITE_URL,
} from "@/lib/config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-ink">
      <div className="shell flex flex-col gap-12 py-20">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 flex flex-col items-start gap-6 lg:col-span-5">
            <Lockup variant="stacked" withTagline />
            <p className="t-body text-fg-muted">
              A members&apos; club for women {AGE_RANGE} in {CITY} who would
              rather have this held than manage it.
            </p>
          </div>

          <div className="col-span-6 flex flex-col gap-3 lg:col-span-3 lg:col-start-7">
            <p className="t-eyebrow">Contact</p>
            <ContactEmail className="t-meta link" />
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                className="t-meta link"
                rel="me noreferrer"
                target="_blank"
              >
                Instagram
              </a>
            ) : (
              <span className="t-meta text-fg-muted">
                Instagram {INSTAGRAM_HANDLE ?? "{{TBD}}"}
              </span>
            )}
          </div>

          <div className="col-span-6 flex flex-col gap-3 lg:col-span-2 lg:col-start-11">
            <p className="t-eyebrow">Legal</p>
            <Link href="/privacy" className="t-meta link">
              Privacy
            </Link>
            <Link href="/terms" className="t-meta link">
              Terms
            </Link>
          </div>
        </div>

        <hr className="rule" />

        <p className="t-meta text-fg-muted">
          © {year} {BRAND_NAME}
        </p>
      </div>

      {/* Printed brochures carry the brand and the application URL. */}
      <div className="print-footer shell">
        {BRAND_NAME} · Apply at {SITE_URL}/#apply
      </div>
    </footer>
  );
}
