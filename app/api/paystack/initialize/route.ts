import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { checkoutSchema } from "@/lib/checkout-schema";
import { createOrderNumber, createPaystackReference } from "@/lib/order-reference";
import { prisma } from "@/lib/prisma";
import { STORE_PRODUCTS } from "@/lib/store";
import { shippingFeeForDatabaseOrder } from "@/lib/shipping";
import { getProductPriceMap } from "@/lib/product-prices";
import { assertStockAvailable, ensureInventoryProducts } from "@/lib/inventory";

export const runtime = "nodejs";

function publicError(message: string, status = 500) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let savedOrderId: string | undefined;

  try {
    const payload = checkoutSchema.parse(await request.json());
    const secret = process.env.PAYSTACK_SECRET_KEY;
    const databaseEnabled = Boolean(process.env.DATABASE_URL);
    const fallbackEnabled = process.env.ALLOW_PAYSTACK_FALLBACK !== "false";
    const fallbackPaymentUrl =
      process.env.PAYSTACK_CART_URL || "https://paystack.shop/pay/btzq7yqk7p";

    const priceMap = databaseEnabled ? await getProductPriceMap() : Object.fromEntries(Object.entries(STORE_PRODUCTS).map(([slug, product]) => [slug, product.priceKobo]));
    const items = payload.items.map((item) => {
      const product = STORE_PRODUCTS[item.slug];
      if (!product) throw new Error("INVALID_PRODUCT");

      return {
        ...product,
        priceKobo: priceMap[item.slug] ?? product.priceKobo,
        quantity: item.quantity,
        lineTotalKobo: (priceMap[item.slug] ?? product.priceKobo) * item.quantity,
      };
    });

    if (databaseEnabled) {
      await ensureInventoryProducts();
      await assertStockAvailable(items.map((item) => ({ slug: item.slug, quantity: item.quantity })));
    }

    const packCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalKobo = items.reduce((sum, item) => sum + item.lineTotalKobo, 0);
    const shippingKobo = databaseEnabled
      ? await shippingFeeForDatabaseOrder(payload.delivery.state, packCount)
      : 0;
    const totalKobo = subtotalKobo + shippingKobo;
    const paystackReference = createPaystackReference();
    const generatedOrderNumber = createOrderNumber();
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin).replace(/\/$/, "");

    // Keep the current shop-link fallback available until production secrets are configured.
    if (!secret || !databaseEnabled) {
      const missing = [!secret && "PAYSTACK_SECRET_KEY", !databaseEnabled && "DATABASE_URL"].filter(Boolean);
      console.warn(`Integrated checkout is missing: ${missing.join(", ")}`);

      if (!fallbackEnabled) {
        return publicError(
          "Secure checkout is not fully configured. Please contact Bridgecare support.",
          503,
        );
      }

      return NextResponse.json({
        authorizationUrl: fallbackPaymentUrl,
        reference: paystackReference,
        orderNumber: generatedOrderNumber,
        subtotalKobo,
        shippingKobo,
        totalKobo,
        databaseSaved: false,
        fallback: true,
      });
    }

    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { email: payload.customer.email.toLowerCase() },
        update: {
          name: payload.customer.fullName,
          phone: payload.customer.phone,
        },
        create: {
          name: payload.customer.fullName,
          email: payload.customer.email.toLowerCase(),
          phone: payload.customer.phone,
        },
      });

      return tx.order.create({
        data: {
          orderNumber: generatedOrderNumber,
          paystackReference,
          subtotalKobo,
          shippingKobo,
          totalKobo,
          customerId: customer.id,
          customerName: payload.customer.fullName,
          customerEmail: payload.customer.email.toLowerCase(),
          customerPhone: payload.customer.phone,
          recipientName: payload.delivery.recipientName,
          recipientPhone: payload.delivery.recipientPhone,
          addressLine1: payload.delivery.addressLine1,
          addressLine2: payload.delivery.addressLine2 || null,
          landmark: payload.delivery.landmark || null,
          city: payload.delivery.city,
          lga: payload.delivery.lga,
          state: payload.delivery.state,
          postalCode: payload.delivery.postalCode || null,
          deliveryInstructions: payload.delivery.deliveryInstructions || null,
          deliveryMethod: "standard",
          items: {
            create: items.map((item) => ({
              productSlug: item.slug,
              productName: item.name,
              quantity: item.quantity,
              unitPriceKobo: item.priceKobo,
              lineTotalKobo: item.lineTotalKobo,
            })),
          },
          payment: {
            create: {
              reference: paystackReference,
              amountKobo: totalKobo,
              currency: "NGN",
              status: "PENDING",
            },
          },
        },
      });
    });

    savedOrderId = order.id;

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        email: payload.customer.email,
        amount: totalKobo,
        currency: "NGN",
        reference: paystackReference,
        callback_url: `${siteUrl}/order-success`,
        metadata: {
          order_id: order.id,
          order_number: order.orderNumber,
          subtotal_kobo: subtotalKobo,
          shipping_kobo: shippingKobo,
          total_kobo: totalKobo,
          custom_fields: [
            { display_name: "Order Number", variable_name: "order_number", value: order.orderNumber },
            { display_name: "Delivery State", variable_name: "delivery_state", value: payload.delivery.state },
            {
              display_name: "Delivery Address",
              variable_name: "delivery_address",
              value: `${payload.delivery.addressLine1}, ${payload.delivery.city}, ${payload.delivery.state}`,
            },
          ],
        },
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.status || !result?.data?.authorization_url) {
      await prisma.$transaction([
        prisma.order.update({ where: { id: order.id }, data: { status: "CANCELLED" } }),
        prisma.payment.update({
          where: { reference: paystackReference },
          data: { status: "FAILED", rawEvent: result ?? { error: "No Paystack response" } },
        }),
      ]);

      console.error("Paystack initialization failed", result);
      return publicError("Paystack could not start the payment. Please try again.", 502);
    }

    return NextResponse.json({
      authorizationUrl: result.data.authorization_url,
      accessCode: result.data.access_code,
      reference: paystackReference,
      orderNumber: order.orderNumber,
      subtotalKobo,
      shippingKobo,
      totalKobo,
      databaseSaved: true,
      fallback: false,
    });
  } catch (error) {
    if (savedOrderId) {
      try {
        await prisma.order.update({ where: { id: savedOrderId }, data: { status: "CANCELLED" } });
      } catch (cleanupError) {
        console.error("Unable to cancel failed checkout order", cleanupError);
      }
    }

    console.error("Checkout initialization error", error);

    if (error instanceof ZodError) {
      return publicError("Please check the delivery form and try again.", 400);
    }
    if (error instanceof Error && error.message === "INVALID_PRODUCT") {
      return publicError("One of the selected products is unavailable.", 400);
    }
    if (error instanceof Error && error.message.startsWith("INSUFFICIENT_STOCK:")) {
      const [, productName, available] = error.message.split(":");
      return publicError(`${productName} does not have enough stock. Available quantity: ${available}.`, 409);
    }

    return publicError("Checkout is temporarily unavailable. Please try again or contact Bridgecare support.");
  }
}
