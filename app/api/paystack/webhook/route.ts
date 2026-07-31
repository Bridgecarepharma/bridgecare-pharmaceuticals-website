import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

type PaystackEvent = {
  event?: string;
  data?: {
    id?: number | string;
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    channel?: string;
    paid_at?: string;
  };
};

export async function POST(request: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Not configured" }, { status: 500 });

  const raw = await request.text();
  const signature = request.headers.get("x-paystack-signature") || "";
  const expected = crypto.createHmac("sha512", secret).update(raw).digest("hex");
  const supplied = Buffer.from(signature, "utf8");
  const calculated = Buffer.from(expected, "utf8");

  if (supplied.length !== calculated.length || !crypto.timingSafeEqual(supplied, calculated)) {
    console.warn("Rejected Paystack webhook with invalid signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ received: true, databaseSaved: false });
  }

  try {
    const event = JSON.parse(raw) as PaystackEvent;
    const transaction = event.data || {};
    const reference = String(transaction.reference || "");
    const providerTransactionId = transaction.id == null ? "" : String(transaction.id);
    const eventType = String(event.event || "unknown");
    const eventKey = `${eventType}:${providerTransactionId || reference || crypto.createHash("sha256").update(raw).digest("hex")}`;

    try {
      await prisma.paymentWebhookEvent.create({
        data: {
          eventKey,
          eventType,
          reference: reference || null,
          providerTransactionId: providerTransactionId || null,
          status: "RECEIVED",
          payload: event as Prisma.InputJsonValue,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        return NextResponse.json({ received: true, duplicate: true });
      }
      throw error;
    }

    if (eventType !== "charge.success") {
      await prisma.paymentWebhookEvent.update({
        where: { eventKey },
        data: { status: "IGNORED", processedAt: new Date() },
      });
      return NextResponse.json({ received: true, ignored: true });
    }

    const order = await prisma.order.findUnique({
      where: { paystackReference: reference },
      include: { payment: true },
    });

    if (!order) {
      await prisma.paymentWebhookEvent.update({
        where: { eventKey },
        data: { status: "ORDER_NOT_FOUND", processedAt: new Date() },
      });
      return NextResponse.json({ received: true });
    }

    const valid =
      transaction.status === "success" &&
      transaction.amount === order.totalKobo &&
      transaction.currency === order.currency;

    if (!valid) {
      await prisma.paymentWebhookEvent.update({
        where: { eventKey },
        data: { status: "VALIDATION_FAILED", orderId: order.id, processedAt: new Date() },
      });
      console.error("Paystack webhook validation failed", {
        reference,
        receivedAmount: transaction.amount,
        expectedAmount: order.totalKobo,
        receivedCurrency: transaction.currency,
        expectedCurrency: order.currency,
      });
      return NextResponse.json({ received: true });
    }

    const paidAt = new Date(transaction.paid_at || Date.now());
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: {
          status: "PAID",
          paidAt,
          paymentChannel: transaction.channel || null,
          paystackTransactionId: providerTransactionId || null,
        },
      }),
      prisma.payment.upsert({
        where: { reference },
        update: {
          status: "SUCCESS",
          channel: transaction.channel || null,
          providerTransactionId: providerTransactionId || null,
          paidAt,
          rawEvent: event as Prisma.InputJsonValue,
        },
        create: {
          orderId: order.id,
          reference,
          amountKobo: Number(transaction.amount),
          currency: String(transaction.currency),
          status: "SUCCESS",
          channel: transaction.channel || null,
          providerTransactionId: providerTransactionId || null,
          paidAt,
          rawEvent: event as Prisma.InputJsonValue,
        },
      }),
      prisma.paymentWebhookEvent.update({
        where: { eventKey },
        data: { status: "PROCESSED", orderId: order.id, processedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ received: true, processed: true });
  } catch (error) {
    console.error("Paystack webhook processing error", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
