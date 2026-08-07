import { NextResponse } from "next/server";
import { getShippingConfiguration } from "@/lib/shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configuration = await getShippingConfiguration();
    return NextResponse.json(configuration, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to load shipping rates", error);
    return NextResponse.json({ error: "Unable to load delivery charges." }, { status: 500 });
  }
}
