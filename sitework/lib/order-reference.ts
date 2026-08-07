import crypto from "crypto";

export function createOrderNumber(now = new Date()) {
  const date = now.toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `BC-${date}-${suffix}`;
}

export function createPaystackReference() {
  return `BC-${Date.now()}-${crypto.randomBytes(5).toString("hex")}`;
}
