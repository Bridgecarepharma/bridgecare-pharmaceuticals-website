import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PRODUCT_BY_SLUG } from "@/data/products";
const clean = (value: unknown, max: number) => String(value ?? "").trim().slice(0, max);
export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return NextResponse.json({ error: "Questions are temporarily unavailable." }, { status: 503 });
  const body = await request.json().catch(() => null); if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  const productSlug = clean(body.productSlug,80); const product = PRODUCT_BY_SLUG[productSlug]; const customerName = clean(body.customerName,80); const customerEmail = clean(body.customerEmail,160).toLowerCase(); const question = clean(body.question,1200);
  if (!product || !customerName || !customerEmail.includes("@") || question.length < 8) return NextResponse.json({ error: "Please complete all required fields." }, { status: 400 });
  const recent = await prisma.productQuestion.count({ where: { customerEmail, productSlug, createdAt: { gte: new Date(Date.now() - 60*60*1000) } } });
  if (recent >= 3) return NextResponse.json({ error: "Please wait before submitting another question." }, { status: 429 });
  await prisma.productQuestion.create({ data: { productSlug, productName: product.name, customerName, customerEmail, question } });
  return NextResponse.json({ ok: true });
}
