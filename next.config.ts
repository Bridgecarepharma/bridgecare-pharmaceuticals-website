import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not set `output: "export"`.
  // Paystack, order verification, webhooks, and Prisma require a server runtime.
};

export default nextConfig;
