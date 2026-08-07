import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);
  const form = await request.formData();
  const productSlug = String(form.get("productSlug") || "");
  const action = String(form.get("action") || "");
  const quantity = Number(form.get("quantity") || 0);
  const reorderLevel = Number(form.get("reorderLevel") || 0);
  const note = String(form.get("note") || "").slice(0, 300);
  const requestedReturnTo = String(form.get("returnTo") || "/admin/inventory");
  const returnTo = requestedReturnTo.startsWith("/admin/") ? requestedReturnTo : "/admin/inventory";
  if (!productSlug || !Number.isInteger(quantity) || quantity < 0) return NextResponse.redirect(`${origin}${returnTo}?error=invalid`, 303);

  await prisma.$transaction(async (tx) => {
    const current = await tx.inventory.findUniqueOrThrow({ where: { productSlug } });
    let delta = 0;
    let movementType: "RESTOCK" | "ADJUSTMENT" = "ADJUSTMENT";
    if (action === "add") { delta = quantity; movementType = "RESTOCK"; }
    else if (action === "remove") { delta = -quantity; }
    else if (action === "set") { delta = quantity - current.stock; }
    else throw new Error("INVALID_ACTION");
    const next = current.stock + delta;
    if (next < 0) throw new Error("NEGATIVE_STOCK");
    const updated = await tx.inventory.update({
      where: { id: current.id },
      data: { stock: next, reorderLevel: Number.isInteger(reorderLevel) && reorderLevel >= 0 ? reorderLevel : current.reorderLevel },
    });
    if (delta !== 0) await tx.inventoryMovement.create({
      data: { inventoryId: current.id, type: movementType, quantity: delta, balanceAfter: updated.stock, note: note || null, createdBy: "admin" },
    });
  });
  return NextResponse.redirect(`${origin}${returnTo}?updated=1`, 303);
}
