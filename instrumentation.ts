/**
 * Runs once when the server starts. In production a missing variable stops the boot;
 * in development it is reported and the dev server keeps running, so the marketing
 * page can be worked on without a database to hand.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { checkEnv } = await import("./lib/env");
  const problems = checkEnv();
  if (problems.length === 0) return;

  const message = `Missing or invalid environment variables:\n${problems
    .map((p) => `  - ${p}`)
    .join("\n")}\n\nCopy .env.example to .env.local and fill it in.`;

  if (process.env.NODE_ENV === "production") throw new Error(message);
  console.warn(`\n[env] ${message}\n`);
}
