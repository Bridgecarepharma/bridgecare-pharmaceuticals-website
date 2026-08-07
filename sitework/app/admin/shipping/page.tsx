import type { Metadata } from "next";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/admin-auth";
import { getShippingConfiguration } from "@/lib/shipping";
import { formatNaira } from "@/lib/store";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Shipping", robots: { index: false, follow: false } };
type SearchParams = Promise<{ updated?: string; error?: string }>;

export default async function AdminShippingPage({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin();
  const params = await searchParams;
  const { zones, freeShippingPackCount } = await getShippingConfiguration();

  return (
    <section className="section admin-shell">
      <div className="container">
        <AdminNav />
        <div className="admin-heading admin-products-heading">
          <div>
            <span className="eyebrow">Bridgecare operations</span>
            <h1>Shipping settings</h1>
            <p>Update delivery charges and the free-delivery pack threshold without editing code.</p>
          </div>
          <Link className="button secondary" href="/checkout" target="_blank">Preview checkout</Link>
        </div>

        {params.updated === "1" && <div className="admin-success">Shipping settings updated successfully.</div>}
        {params.error && <div className="admin-alert">The shipping setting could not be saved. Check the amount and try again.</div>}

        <div className="shipping-admin-grid">
          {zones.map((zone) => (
            <article className="shipping-admin-card" key={zone.code}>
              <div className="shipping-admin-summary">
                <div>
                  <span className="eyebrow">{zone.code.replaceAll("_", " ")}</span>
                  <h2>{zone.name}</h2>
                  <p>{zone.states.join(", ")}</p>
                </div>
                <strong>{formatNaira(zone.priceKobo)}</strong>
              </div>
              <form className="shipping-admin-form" action="/api/admin/shipping/update" method="post">
                <input type="hidden" name="code" value={zone.code} />
                <label>
                  Delivery charge (₦)
                  <input name="priceNaira" type="number" min="0" step="1" defaultValue={Math.round(zone.priceKobo / 100)} required />
                </label>
                <label>
                  Free delivery from this number of packs
                  <input name="freeShippingPackCount" type="number" min="0" step="1" defaultValue={freeShippingPackCount} required />
                  <small>Enter 0 to disable automatic free delivery.</small>
                </label>
                <label className="shipping-toggle">
                  <input name="isActive" type="checkbox" defaultChecked={zone.isActive} />
                  <span>Zone is available at checkout</span>
                </label>
                <button className="button" type="submit">Save shipping settings</button>
              </form>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
