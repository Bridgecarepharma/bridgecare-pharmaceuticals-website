import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> },
) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Order tracking is not configured." }, { status: 503 });
  }

  const { reference } = await params;
  const order = await prisma.order.findUnique({
    where: { paystackReference: reference },
    include: { items: true, payment: true },
  });

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}
