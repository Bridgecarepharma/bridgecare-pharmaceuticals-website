import { spawnSync } from "node:child_process";

const npx = process.platform === "win32" ? "npx.cmd" : "npx";
const migrations = [
  "20260807010000_add_product_reviews",
  "20260807220000_reviews_and_questions",
];

for (const migration of migrations) {
  const result = spawnSync(
    npx,
    ["prisma", "migrate", "resolve", "--applied", migration],
    { encoding: "utf8", env: process.env }
  );

  const output = `${result.stdout || ""}\n${result.stderr || ""}`;

  if (result.status === 0) {
    console.log(`Resolved ${migration} as applied.`);
    continue;
  }

  if (/P3008|already.*applied|already.*recorded/i.test(output)) {
    console.log(`${migration} was already resolved; continuing.`);
    continue;
  }

  console.error(output.trim());
  process.exit(result.status || 1);
}
