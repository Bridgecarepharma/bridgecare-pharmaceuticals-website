import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);

  const form = await request.formData();
  const productSlug = String(form.get("productSlug") || "");
  const priceNaira = Number(form.get("priceNaira") || 0);
  if (!productSlug || !Number.isFinite(priceNaira) || priceNaira <= 0) {
    return NextResponse.redirect(`${origin}/admin/prices?error=invalid`, 303);
  }

  const priceKobo = Math.round(priceNaira * 100);
  const current = await prisma.inventory.findUnique({ where: { productSlug } });
  if (!current) return NextResponse.redirect(`${origin}/admin/prices?error=missing`, 303);

  await prisma.$transaction([
    prisma.inventory.update({ where: { productSlug }, data: { priceKobo } }),
    prisma.adminAuditLog.create({
      data: {
        action: "UPDATE_PRODUCT_PRICE",
        entity: "Inventory",
        entityId: current.id,
        details: { productSlug, oldPriceKobo: current.priceKobo, newPriceKobo: priceKobo },
      },
    }),
  ]);

  return NextResponse.redirect(`${origin}/admin/prices?updated=1`, 303);
}
