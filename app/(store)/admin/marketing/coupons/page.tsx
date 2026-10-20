import type { Metadata } from "next";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { ensureInventoryProducts } from "@/lib/inventory";
import { formatNaira } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coupon Management", robots: { index: false, follow: false } };
type SearchParams = Promise<{ saved?: string; error?: string }>;

function inputDate(value: Date | null) {
  if (!value) return "";
  const local = new Date(value.getTime() - value.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function couponValue(coupon: { type: string; percentageBasisPoints: number; valueKobo: number }) {
  if (coupon.type === "PERCENTAGE") return `${coupon.percentageBasisPoints / 100}%`;
  if (coupon.type === "FIXED_AMOUNT") return formatNaira(coupon.valueKobo);
  return "Free delivery";
}

export default async function CouponsPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  await ensureInventoryProducts();
  const params = await searchParams;
  const [coupons, products] = await Promise.all([
    prisma.coupon.findMany({ include: { _count: { select: { redemptions: true } } }, orderBy: { createdAt: "desc" } }),
    prisma.inventory.findMany({ where: { isActive: true }, orderBy: { productName: "asc" } }),
  ]);

  return <section className="section admin-shell"><div className="container">
    <AdminNav />
    <div className="admin-heading"><div><span className="eyebrow">Marketing centre</span><h1>Coupons and discounts</h1><p>Create percentage, fixed-amount and free-delivery promotions. Checkout validates every coupon on the server.</p></div></div>
    {params.saved && <div className="admin-success">Coupon changes saved successfully.</div>}
    {params.error && <div className="admin-alert">The coupon could not be saved. Check the code, dates and discount values.</div>}

    <article className="admin-card coupon-create-card">
      <div className="admin-card-heading"><div><span className="eyebrow">New promotion</span><h2>Create coupon</h2></div></div>
      <form className="coupon-admin-form" action="/api/admin/marketing/coupons" method="post">
        <input type="hidden" name="action" value="create" />
        <div className="form-row"><label>Coupon code<input name="code" required maxLength={30} placeholder="WELCOME10" /></label><label>Campaign name<input name="name" required maxLength={100} placeholder="Welcome discount" /></label></div>
        <label>Description<textarea name="description" maxLength={300} placeholder="Optional internal description" /></label>
        <div className="form-row"><label>Discount type<select name="type" defaultValue="PERCENTAGE"><option value="PERCENTAGE">Percentage</option><option value="FIXED_AMOUNT">Fixed amount</option><option value="FREE_SHIPPING">Free delivery</option></select></label><label>Discount value<input name="discountValue" type="number" min="0" step="0.01" defaultValue="10" /><small>Enter percent for percentage coupons or naira for fixed discounts.</small></label></div>
        <div className="form-row"><label>Minimum product subtotal (₦)<input name="minimumSubtotalNaira" type="number" min="0" step="1" defaultValue="0" /></label><label>Maximum percentage discount (₦)<input name="maximumDiscountNaira" type="number" min="0" step="1" placeholder="Optional" /></label></div>
        <div className="form-row"><label>Starts at<input name="startsAt" type="datetime-local" /></label><label>Expires at<input name="expiresAt" type="datetime-local" /></label></div>
        <div className="form-row"><label>Total usage limit<input name="usageLimit" type="number" min="1" step="1" placeholder="Unlimited" /></label><label>Uses per customer<input name="perCustomerLimit" type="number" min="0" step="1" defaultValue="1" /></label></div>
        <fieldset><legend>Applicable products</legend><p className="field-help">Leave all unchecked to apply the coupon to every product.</p><div className="coupon-product-options">{products.map(product=><label key={product.id}><input type="checkbox" name="productSlugs" value={product.productSlug}/><span>{product.productName}</span></label>)}</div></fieldset>
        <div className="coupon-switches"><label><input type="checkbox" name="firstOrderOnly" value="1"/> First paid order only</label><label><input type="checkbox" name="isActive" value="1" defaultChecked/> Active immediately</label></div>
        <button className="button" type="submit">Create coupon</button>
      </form>
    </article>

    <div className="admin-heading compact"><div><span className="eyebrow">Campaign library</span><h2>Existing coupons</h2><p>{coupons.length} coupon{coupons.length === 1 ? "" : "s"} configured.</p></div></div>
    <div className="coupon-admin-grid">{coupons.map(coupon=>{
      const selectedProducts = Array.isArray(coupon.applicableProductSlugs) ? coupon.applicableProductSlugs.filter((x): x is string => typeof x === "string") : [];
      const expired = Boolean(coupon.expiresAt && coupon.expiresAt < new Date());
      return <article className="admin-card coupon-admin-card" key={coupon.id}>
        <div className="coupon-card-top"><div><span className="coupon-code">{coupon.code}</span><h2>{coupon.name}</h2><p>{coupon.description || "No description"}</p></div><span className={`status-pill ${coupon.isActive && !expired ? "active" : "inactive"}`}>{expired ? "Expired" : coupon.isActive ? "Active" : "Inactive"}</span></div>
        <div className="coupon-metrics"><div><span>Offer</span><strong>{couponValue(coupon)}</strong></div><div><span>Redeemed</span><strong>{coupon.usesCount}{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}</strong></div><div><span>Reservations</span><strong>{coupon._count.redemptions}</strong></div></div>
        <form className="coupon-admin-form compact" action="/api/admin/marketing/coupons" method="post">
          <input type="hidden" name="action" value="update"/><input type="hidden" name="id" value={coupon.id}/>
          <div className="form-row"><label>Code<input name="code" defaultValue={coupon.code} required /></label><label>Name<input name="name" defaultValue={coupon.name} required /></label></div>
          <label>Description<textarea name="description" defaultValue={coupon.description || ""}/></label>
          <div className="form-row"><label>Type<select name="type" defaultValue={coupon.type}><option value="PERCENTAGE">Percentage</option><option value="FIXED_AMOUNT">Fixed amount</option><option value="FREE_SHIPPING">Free delivery</option></select></label><label>Value<input name="discountValue" type="number" min="0" step="0.01" defaultValue={coupon.type === "PERCENTAGE" ? coupon.percentageBasisPoints / 100 : coupon.valueKobo / 100}/></label></div>
          <div className="form-row"><label>Minimum subtotal (₦)<input name="minimumSubtotalNaira" type="number" min="0" defaultValue={coupon.minimumSubtotalKobo / 100}/></label><label>Maximum discount (₦)<input name="maximumDiscountNaira" type="number" min="0" defaultValue={coupon.maximumDiscountKobo ? coupon.maximumDiscountKobo / 100 : ""}/></label></div>
          <div className="form-row"><label>Starts at<input name="startsAt" type="datetime-local" defaultValue={inputDate(coupon.startsAt)}/></label><label>Expires at<input name="expiresAt" type="datetime-local" defaultValue={inputDate(coupon.expiresAt)}/></label></div>
          <div className="form-row"><label>Usage limit<input name="usageLimit" type="number" min="1" defaultValue={coupon.usageLimit || ""}/></label><label>Per customer<input name="perCustomerLimit" type="number" min="0" defaultValue={coupon.perCustomerLimit}/></label></div>
          <fieldset><legend>Applicable products</legend><div className="coupon-product-options">{products.map(product=><label key={product.id}><input type="checkbox" name="productSlugs" value={product.productSlug} defaultChecked={selectedProducts.includes(product.productSlug)}/><span>{product.productName}</span></label>)}</div></fieldset>
          <div className="coupon-switches"><label><input type="checkbox" name="firstOrderOnly" value="1" defaultChecked={coupon.firstOrderOnly}/> First order only</label><label><input type="checkbox" name="isActive" value="1" defaultChecked={coupon.isActive}/> Active</label></div>
          <div className="coupon-actions"><button className="button" type="submit">Save changes</button><button className="button secondary" type="submit" name="action" value="toggle">{coupon.isActive ? "Deactivate" : "Activate"}</button><button className="text-danger" type="submit" name="action" value="delete" formNoValidate>Delete</button></div>
        </form>
      </article>})}</div>
  </div></section>;
}
