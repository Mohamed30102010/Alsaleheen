// Runs before `next build` on Vercel: creates tables + seeds sample data (idempotent).
import { execSync } from "node:child_process";
if (!process.env.DATABASE_URL) {
  console.warn("\n[setup-db] DATABASE_URL is not set -> skipping DB setup. Site will show empty states until it is set.\n");
  process.exit(0);
}
const run = (cmd) => execSync(cmd, { stdio: "inherit" });
try {
  run("npx prisma db push --skip-generate");
  run("npx tsx prisma/seed.ts");
} catch (e) {
  console.error("[setup-db] failed:", e?.message);
  process.exit(1);
}
