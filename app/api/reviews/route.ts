import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCT_BY_SLUG } from "@/data/products";

const paidStatuses = ["PAID","PROCESSING","PACKED","DISPATCHED","DELIVERED"] as const;
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Reviews are temporarily unavailable." }, { status: 503 });
  const body = await request.json().catch(() => null); if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const productSlug = clean(body.productSlug, 80); const product = PRODUCT_BY_SLUG[productSlug];
  const customerName = clean(body.customerName, 80); const customerEmail = clean(body.customerEmail, 160).toLowerCase(); const reviewBody = clean(body.body, 2000); const rating = Number(body.rating);
  if (!product || !customerName || !customerEmail.includes("@") || reviewBody.length < 10 || !Number.isInteger(rating) || rating < 1 || rating > 5) return NextResponse.json({ error: "Please complete all required review fields." }, { status: 400 });
  const orderNumber = clean(body.orderNumber, 80);
  let verifiedPurchase = false;
  if (orderNumber) {
    const order = await prisma.order.findFirst({ where: { orderNumber: { equals: orderNumber, mode: "insensitive" }, customerEmail: { equals: customerEmail, mode: "insensitive" }, status: { in: [...paidStatuses] }, items: { some: { productSlug } } }, select: { id: true } });
    verifiedPurchase = Boolean(order);
  }
  const recent = await prisma.productReview.count({ where: { customerEmail, productSlug, createdAt: { gte: new Date(Date.now() - 24*60*60*1000) } } });
  if (recent >= 2) return NextResponse.json({ error: "You have already submitted a recent review for this product." }, { status: 429 });
  await prisma.productReview.create({ data: { productSlug, productName: product.name, customerName, customerEmail, city: clean(body.city,80) || null, orderNumber: orderNumber || null, rating, title: clean(body.title,120) || null, body: reviewBody, verifiedPurchase } });
  return NextResponse.json({ ok: true });
}
