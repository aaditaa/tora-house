import { z } from "zod";

/**
 * Every server-side variable the app needs, validated in one place so a missing key
 * fails with its own name rather than mysteriously at request time.
 *
 * DATABASE_URL is the POOLED Neon connection string — the host containing "-pooler".
 * It is server-only and must never be prefixed NEXT_PUBLIC_.
 */
const schema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().min(1, "must be the public origin, e.g. https://example.com"),
  DATABASE_URL: z
    .string()
    .min(1, "must be the pooled Neon connection string")
    .refine((v) => v.startsWith("postgres"), "must be a postgres:// connection string"),
  RESEND_API_KEY: z.string().min(1, "must be a Resend API key"),
  NOTIFY_EMAIL: z.string().min(3, "must be the address application alerts go to"),
  FROM_EMAIL: z
    .string()
    .min(3, 'must be a verified Resend sender, e.g. "Name <hello@example.com>"'),
  EXPORT_TOKEN: z.string().min(16, "must be at least 16 characters"),
});

export type Env = z.infer<typeof schema>;

let cached: Env | null = null;

/** Returns a list of human-readable problems. Empty means the environment is fine. */
export function checkEnv(): string[] {
  const result = schema.safeParse(process.env);
  if (result.success) return [];
  return result.error.issues.map((issue) => `${issue.path.join(".")} — ${issue.message}`);
}

/**
 * The validated environment. Throws once, naming every variable that is wrong.
 * Resolved lazily so that `next build` can render the marketing page on a machine
 * that holds no secrets.
 */
export function env(): Env {
  if (cached) return cached;
  const result = schema.safeParse(process.env);
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")} — ${issue.message}`)
      .join("\n");
    throw new Error(
      `Missing or invalid environment variables:\n${problems}\n\nCopy .env.example to .env.local and fill it in.`,
    );
  }
  cached = result.data;
  return cached;
}
