import { readFileSync, existsSync } from "node:fs";

const forbidden = [
  ["next.config.js", /output\s*:\s*["']export["']/],
  ["next.config.mjs", /output\s*:\s*["']export["']/],
  ["next.config.ts", /output\s*:\s*["']export["']/],
  ["netlify.toml", /publish\s*=\s*["']out["']/],
  ["package.json", /next\s+export/],
];

for (const [file, pattern] of forbidden) {
  if (existsSync(file) && pattern.test(readFileSync(file, "utf8"))) {
    console.error(`Invalid static-export setting found in ${file}.`);
    process.exit(1);
  }
}

console.log("Deployment configuration check passed: server runtime enabled.");
