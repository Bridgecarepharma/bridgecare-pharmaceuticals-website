import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { ensureShippingConfiguration } from "@/lib/shipping";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);

  const form = await request.formData();
  const code = String(form.get("code") || "").trim();
  const priceNaira = Number(form.get("priceNaira") || 0);
  const isActive = form.get("isActive") === "on";
  const freeShippingPackCount = Number(form.get("freeShippingPackCount") || 0);

  if (!code || !Number.isFinite(priceNaira) || priceNaira < 0 || !Number.isInteger(freeShippingPackCount) || freeShippingPackCount < 0) {
    return NextResponse.redirect(`${origin}/admin/shipping?error=invalid`, 303);
  }

  await ensureShippingConfiguration();
  const zone = await prisma.shippingZone.findUnique({ where: { code } });
  if (!zone) return NextResponse.redirect(`${origin}/admin/shipping?error=missing`, 303);

  const priceKobo = Math.round(priceNaira * 100);
  await prisma.$transaction([
    prisma.shippingZone.update({ where: { code }, data: { priceKobo, isActive } }),
    prisma.shippingSetting.upsert({
      where: { id: "default" },
      update: { freeShippingPackCount },
      create: { id: "default", freeShippingPackCount },
    }),
    prisma.adminAuditLog.create({
      data: {
        action: "UPDATE_SHIPPING_ZONE",
        entity: "ShippingZone",
        entityId: zone.id,
        details: {
          code,
          oldPriceKobo: zone.priceKobo,
          newPriceKobo: priceKobo,
          oldActive: zone.isActive,
          newActive: isActive,
          freeShippingPackCount,
        },
      },
    }),
  ]);

  return NextResponse.redirect(`${origin}/admin/shipping?updated=1`, 303);
}
