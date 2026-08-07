import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { normalizeCouponCode } from "@/lib/coupons";
import { prisma } from "@/lib/prisma";

function num(value: FormDataEntryValue | null, fallback = 0) {
  const parsed = Number(value ?? fallback);
  return Number.isFinite(parsed) ? parsed : fallback;
}
function date(value: FormDataEntryValue | null) {
  const text = String(value || "").trim();
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);
  const form = await request.formData();
  const action = String(form.get("action") || "create");
  const id = String(form.get("id") || "");

  try {
    if (action === "toggle" && id) {
      const current = await prisma.coupon.findUniqueOrThrow({ where: { id } });
      await prisma.$transaction([
        prisma.coupon.update({ where: { id }, data: { isActive: !current.isActive } }),
        prisma.adminAuditLog.create({ data: { action: "TOGGLE_COUPON", entity: "Coupon", entityId: id, details: { code: current.code, isActive: !current.isActive } } }),
      ]);
      return NextResponse.redirect(`${origin}/admin/marketing/coupons?saved=1`, 303);
    }

    if (action === "delete" && id) {
      const current = await prisma.coupon.findUniqueOrThrow({ where: { id }, include: { _count: { select: { redemptions: true } } } });
      if (current._count.redemptions > 0) {
        await prisma.coupon.update({ where: { id }, data: { isActive: false } });
      } else {
        await prisma.coupon.delete({ where: { id } });
      }
      await prisma.adminAuditLog.create({ data: { action: current._count.redemptions > 0 ? "ARCHIVE_COUPON" : "DELETE_COUPON", entity: "Coupon", entityId: id, details: { code: current.code } } });
      return NextResponse.redirect(`${origin}/admin/marketing/coupons?saved=1`, 303);
    }

    const code = normalizeCouponCode(String(form.get("code") || ""));
    const name = String(form.get("name") || "").trim();
    const description = String(form.get("description") || "").trim() || null;
    const type = String(form.get("type") || "PERCENTAGE") as "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";
    const discountValue = num(form.get("discountValue"));
    const startsAt = date(form.get("startsAt"));
    const expiresAt = date(form.get("expiresAt"));
    if (!code || !name || !["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"].includes(type) || (startsAt && expiresAt && expiresAt <= startsAt)) throw new Error("INVALID");
    if (type === "PERCENTAGE" && (discountValue <= 0 || discountValue > 100)) throw new Error("INVALID");
    if (type === "FIXED_AMOUNT" && discountValue <= 0) throw new Error("INVALID");

    const usageLimitValue = String(form.get("usageLimit") || "").trim();
    const maxDiscountValue = String(form.get("maximumDiscountNaira") || "").trim();
    const productSlugs = form.getAll("productSlugs").map(String).filter(Boolean);
    const data = {
      code,
      name,
      description,
      type,
      percentageBasisPoints: type === "PERCENTAGE" ? Math.round(discountValue * 100) : 0,
      valueKobo: type === "FIXED_AMOUNT" ? Math.round(discountValue * 100) : 0,
      minimumSubtotalKobo: Math.max(0, Math.round(num(form.get("minimumSubtotalNaira")) * 100)),
      maximumDiscountKobo: maxDiscountValue ? Math.max(0, Math.round(Number(maxDiscountValue) * 100)) : null,
      startsAt,
      expiresAt,
      usageLimit: usageLimitValue ? Math.max(1, Math.floor(Number(usageLimitValue))) : null,
      perCustomerLimit: Math.max(0, Math.floor(num(form.get("perCustomerLimit"), 1))),
      firstOrderOnly: form.get("firstOrderOnly") === "1",
      applicableProductSlugs: productSlugs,
      isActive: form.get("isActive") === "1",
    };

    if (action === "update" && id) {
      const previous = await prisma.coupon.findUniqueOrThrow({ where: { id } });
      await prisma.$transaction([
        prisma.coupon.update({ where: { id }, data }),
        prisma.adminAuditLog.create({ data: { action: "UPDATE_COUPON", entity: "Coupon", entityId: id, details: { oldCode: previous.code, newCode: code } } }),
      ]);
    } else {
      const created = await prisma.coupon.create({ data });
      await prisma.adminAuditLog.create({ data: { action: "CREATE_COUPON", entity: "Coupon", entityId: created.id, details: { code } } });
    }
    return NextResponse.redirect(`${origin}/admin/marketing/coupons?saved=1`, 303);
  } catch (error) {
    console.error("Coupon admin error", error);
    return NextResponse.redirect(`${origin}/admin/marketing/coupons?error=1`, 303);
  }
}
