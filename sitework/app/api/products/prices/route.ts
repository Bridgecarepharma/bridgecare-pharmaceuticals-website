import { NextResponse } from "next/server";
import { ensureInventoryProducts } from "@/lib/inventory";
import { getProductPriceMap } from "@/lib/product-prices";

export const dynamic = "force-dynamic";

export async function GET() {
  await ensureInventoryProducts();
  return NextResponse.json({ prices: await getProductPriceMap() });
}
