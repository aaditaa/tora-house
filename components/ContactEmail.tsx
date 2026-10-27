import { CONTACT_EMAIL, contactEmailLabel } from "@/lib/config";

/**
 * The public address. Renders a real mailto: once it is supplied, and the visible
 * marker as plain text until then — a dead `mailto:{{TBD}}` is worse than no link,
 * because it opens an empty compose window on a woman who wanted to reach someone.
 */
export function ContactEmail({
  subject,
  className = "link",
}: {
  subject?: string;
  className?: string;
}) {
  if (!CONTACT_EMAIL) {
    return <span className="text-fg-muted">{contactEmailLabel()}</span>;
  }

  const href = subject
    ? `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`
    : `mailto:${CONTACT_EMAIL}`;

  return (
    <a href={href} className={className}>
      {CONTACT_EMAIL}
    </a>
  );
}
