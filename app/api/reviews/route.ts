import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PRODUCT_BY_SLUG } from "@/data/products";

const schema = z.object({
  productSlug: z.string().min(1),
  customerName: z.string().trim().min(2).max(80),
  customerEmail: z.string().trim().email().max(160),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  orderNumber: z.string().trim().max(80).optional().or(z.literal("")),
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional().or(z.literal("")),
  body: z.string().trim().min(12).max(2000),
  imageUrls: z.array(z.string().url()).max(3).default([]),
});

export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const product = PRODUCT_BY_SLUG[input.productSlug];
    if (!product) return NextResponse.json({ error: "Product not found." }, { status: 404 });

    const email = input.customerEmail.toLowerCase();
    let verifiedPurchase = false;
    if (input.orderNumber) {
      const order = await prisma.order.findFirst({
        where: {
          orderNumber: input.orderNumber,
          customerEmail: { equals: email, mode: "insensitive" },
          status: { in: ["PAID", "PROCESSING", "PACKED", "DISPATCHED", "DELIVERED"] },
          items: { some: { productSlug: input.productSlug } },
        },
        select: { id: true },
      });
      verifiedPurchase = Boolean(order);
    }

    const recentDuplicate = await prisma.productReview.findFirst({
      where: {
        customerEmail: { equals: email, mode: "insensitive" },
        productSlug: input.productSlug,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
      select: { id: true },
    });
    if (recentDuplicate) return NextResponse.json({ error: "A review for this product was already submitted recently." }, { status: 409 });

    await prisma.productReview.create({
      data: {
        productSlug: input.productSlug,
        productName: product.name,
        customerName: input.customerName,
        customerEmail: email,
        city: input.city || null,
        orderNumber: input.orderNumber || null,
        rating: input.rating,
        title: input.title || null,
        body: input.body,
        verifiedPurchase,
        images: { create: input.imageUrls.map((imageUrl) => ({ imageUrl, altText: `${product.name} customer review image` })) },
      },
    });

    return NextResponse.json({ ok: true, verifiedPurchase, message: "Thank you. Your review is awaiting approval." });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message || "Please check the form." }, { status: 400 });
    console.error("review submission failed", error);
    return NextResponse.json({ error: "Unable to submit your review right now." }, { status: 500 });
  }
}
