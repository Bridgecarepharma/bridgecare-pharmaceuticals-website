import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { slugify } from "@/lib/health-cms";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export async function POST(request: Request) {
  const origin = new URL(request.url).origin;
  if (!(await isAdminAuthenticated())) return NextResponse.redirect(`${origin}/admin/login`, 303);
  const form = await request.formData();
  const name = String(form.get("name") || "").trim();
  const slug = slugify(String(form.get("slug") || name));
  const description = String(form.get("description") || "").trim() || null;
  if (!name || !slug) return NextResponse.redirect(`${origin}/admin/health-centre/categories?error=invalid`, 303);
  try {
    await prisma.healthCategory.upsert({ where: { slug }, update: { name, description }, create: { name, slug, description } });
    return NextResponse.redirect(`${origin}/admin/health-centre/categories?updated=1`, 303);
  } catch {
    return NextResponse.redirect(`${origin}/admin/health-centre/categories?error=save`, 303);
  }
}
