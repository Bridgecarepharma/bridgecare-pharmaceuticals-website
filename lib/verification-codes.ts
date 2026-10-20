import { createHash, randomInt } from "node:crypto";

export const VERIFICATION_PRODUCTS = {
 asfenositol: { name: "AsFenositol Tablets", registration: "A7-102870" },
 globivida: { name: "Globivida Capsules", registration: "A7-104145L" },
} as const;

export function normalizeSecurityCode(value: string) {
 return value.trim().replace(/[\s-]/g, "").toUpperCase();
}
export function securityCodeHash(value: string) {
 return createHash("sha256").update(normalizeSecurityCode(value)).digest("hex");
}
export function generateSecurityCodes(count: number) {
 if (!Number.isInteger(count) || count < 1 || count > 5000) throw new Error("Choose 1 to 5,000 codes.");
 const codes = new Set<string>();
 // Four independent, unbiased random groups retain leading zeros as text.
 while (codes.size < count) codes.add(Array.from({ length: 4 }, () => randomInt(0, 10000).toString().padStart(4, "0")).join(""));
 return [...codes].map(code => ({ code: code.match(/.{4}/g)!.join("-"), codeHash: securityCodeHash(code) }));
}
export function csvCell(value: string) {
 // Prevent spreadsheet formulas in manufacturer exports.
 const safe = /^[=+\-@\t\r\n]/.test(value) ? `'${value}` : value;
 return `"${safe.replace(/"/g, '""')}"`;
}
