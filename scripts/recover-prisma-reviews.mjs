import { spawnSync } from "node:child_process";

const migration = "20260807010000_add_product_reviews";
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(command, ["prisma", "migrate", "resolve", "--applied", migration], {
  encoding: "utf8",
  stdio: "pipe",
  env: process.env,
});
const output = `${result.stdout || ""}\n${result.stderr || ""}`;

if (result.status === 0) {
  console.log(`Resolved failed duplicate migration ${migration} as applied.`);
} else if (/P3008|already.*applied|already.*recorded/i.test(output)) {
  console.log(`Migration ${migration} is already resolved; continuing.`);
} else {
  console.error(output.trim());
  process.exit(result.status || 1);
}
