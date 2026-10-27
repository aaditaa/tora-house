import Link from "next/link";

import { BRAND_NAME } from "@/lib/config";

/** The legal pages stay in the same type system as the rest of the site. */
export function LegalLayout({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="shell flex h-20 items-center border-b border-rule">
        <Link href="/" className="link-quiet font-display text-xl tracking-tight">
          {BRAND_NAME}
        </Link>
      </header>

      <main className="section">
        <div className="shell grid-12">
          <div className="col-span-12 flex flex-col gap-6 lg:col-span-8 lg:col-start-3">
            <hr className="rule-gold" />
            <p className="t-eyebrow">{eyebrow}</p>
            <h1 className="t-h2">{title}</h1>
            <p className="t-meta text-fg-muted">Last updated {updated}</p>
            <div className="flex flex-col gap-10 pt-6">{children}</div>
            <hr className="rule mt-6" />
            <p className="t-meta">
              <Link href="/" className="link">
                Back to the main page
              </Link>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="t-h3">{heading}</h2>
      {children}
    </section>
  );
}
