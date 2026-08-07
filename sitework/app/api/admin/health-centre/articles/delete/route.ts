import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);
  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  if (!id) return NextResponse.redirect(`${origin}/admin/health-centre?error=missing`, 303);
  await prisma.healthArticle.delete({ where: { id } });
  await prisma.adminAuditLog.create({ data: { action: "DELETE_HEALTH_ARTICLE", entity: "HealthArticle", entityId: id } });
  return NextResponse.redirect(`${origin}/admin/health-centre?deleted=1`, 303);
}
