import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Keep the endpoint closed for older checkout tabs and direct requests.
export async function POST() {
  return NextResponse.json(
    { error: "Pay on Delivery is no longer available. Please pay online with Paystack." },
    { status: 410 },
  );
}
