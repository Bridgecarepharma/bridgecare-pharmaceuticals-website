import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redeemCouponForOrder } from "@/lib/coupons";

export const runtime = "nodejs";

function normalizedCurrency(value: unknown) {
  return String(value || "").trim().toUpperCase();
}

export async function GET(request: Request) {
  try {
    const reference = new URL(request.url).searchParams.get("reference")?.trim();
    if (!reference) return NextResponse.json({ error: "Missing payment reference." }, { status: 400 });

    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) return NextResponse.json({ error: "Payment verification is temporarily unavailable." }, { status: 500 });

    const databaseEnabled = Boolean(process.env.DATABASE_URL);

    // A signed Paystack charge.success webhook may reach us before the browser
    // returns from Paystack. If that webhook has already marked this exact order
    // and payment as successful, the order is already safely verified.
    if (databaseEnabled) {
      const existing = await prisma.order.findUnique({
        where: { paystackReference: reference },
        include: { items: true, payment: true, customer: true },
      });
      if (!existing) return NextResponse.json({ error: "Order not found." }, { status: 404 });
      if (existing.status === "PAID" && existing.payment?.status === "SUCCESS") {
        return NextResponse.json({ paid: true, order: existing, verifiedBy: "webhook" });
      }
    }

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" },
    );
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.status || !result?.data) {
      console.error("Paystack verify API error", { reference, httpStatus: response.status, result });
      return NextResponse.json(
        { paid: false, retryable: response.status >= 500, error: "Unable to verify payment." },
        { status: response.status >= 500 ? 502 : 400 },
      );
    }

    const providerStatus = String(result.data.status || "").toLowerCase();

    if (databaseEnabled) {
      const order = await prisma.order.findUnique({
        where: { paystackReference: reference },
        include: { items: true, payment: true, customer: true },
      });
      if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

      const receivedAmount = Number(result.data.amount);
      const expectedAmount = Number(order.totalKobo);
      const receivedCurrency = normalizedCurrency(result.data.currency);
      const expectedCurrency = normalizedCurrency(order.currency || "NGN");
      const amountMatches = Number.isFinite(receivedAmount) && receivedAmount === expectedAmount;
      const currencyMatches = receivedCurrency === expectedCurrency;
      const providerSucceeded = providerStatus === "success";
      const paid = providerSucceeded && amountMatches && currencyMatches;

      if (paid) {
        const paidAt = new Date(result.data.paid_at || Date.now());
        await prisma.$transaction(async (tx) => {
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: "PAID",
              paidAt,
              paymentChannel: result.data.channel || null,
              paystackTransactionId: String(result.data.id),
            },
          });
          await tx.payment.upsert({
            where: { reference },
            update: {
              status: "SUCCESS",
              channel: result.data.channel || null,
              providerTransactionId: String(result.data.id),
              paidAt,
              rawEvent: result.data,
            },
            create: {
              orderId: order.id,
              reference,
              amountKobo: receivedAmount,
              currency: receivedCurrency,
              status: "SUCCESS",
              channel: result.data.channel || null,
              providerTransactionId: String(result.data.id),
              paidAt,
              rawEvent: result.data,
            },
          });
          await redeemCouponForOrder(tx, order.id);
        });
        const refreshed = await prisma.order.findUnique({
          where: { id: order.id },
          include: { items: true, payment: true, customer: true },
        });
        return NextResponse.json({ paid: true, order: refreshed, verifiedBy: "verify-api" });
      }

      // A just-completed Paystack redirect can briefly arrive before the
      // transaction becomes success in the verify endpoint. Tell the browser to
      // retry instead of presenting a permanent failure screen immediately.
      if (!providerSucceeded) {
        return NextResponse.json(
          { paid: false, retryable: true, providerStatus },
          { status: 202 },
        );
      }

      console.error("Paystack verification mismatch", {
        reference,
        receivedAmount,
        expectedAmount,
        receivedCurrency,
        expectedCurrency,
        providerStatus,
      });
      return NextResponse.json(
        { paid: false, retryable: false, error: "Payment details did not match this order. Please contact support." },
        { status: 409 },
      );
    }

    const metadata = result.data.metadata || {};
    const receivedAmount = Number(result.data.amount);
    const expectedAmount = Number(metadata.total_kobo || receivedAmount);
    const receivedCurrency = normalizedCurrency(result.data.currency);
    const paid = providerStatus === "success" && receivedAmount === expectedAmount && receivedCurrency === "NGN";
    if (!paid) {
      if (providerStatus !== "success") {
        return NextResponse.json({ paid: false, retryable: true, providerStatus }, { status: 202 });
      }
      return NextResponse.json({ paid: false, retryable: false, error: "Payment has not been confirmed." }, { status: 400 });
    }

    const items = Array.isArray(metadata.items) ? metadata.items : [];
    const fallbackOrder = {
      orderNumber: String(metadata.order_number || reference),
      paystackReference: reference,
      status: "PAID",
      totalKobo: receivedAmount,
      recipientName: String(metadata.recipient_name || metadata.customer_name || "Customer"),
      addressLine1: String(metadata.address_line_1 || "Delivery address submitted at checkout"),
      addressLine2: String(metadata.address_line_2 || ""),
      city: String(metadata.city || ""),
      lga: String(metadata.lga || ""),
      state: String(metadata.state || ""),
      items: items.map((item: { productName?: string; quantity?: number; lineTotalKobo?: number }, index: number) => ({
        id: `fallback-${index}`,
        productName: String(item.productName || "Bridgecare product"),
        quantity: Number(item.quantity || 1),
        lineTotalKobo: Number(item.lineTotalKobo || 0),
      })),
    };
    return NextResponse.json({ paid: true, order: fallbackOrder, databaseSaved: false });
  } catch (error) {
    console.error("Payment verification error", error);
    return NextResponse.json({ paid: false, retryable: true, error: "Unable to verify payment right now." }, { status: 500 });
  }
}
