"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  ["/admin", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/customers", "Customers"],
  ["/admin/products", "Products & stock"],
  ["/admin/prices", "Prices"],
  ["/admin/shipping", "Shipping"],
  ["/admin/health-centre", "Health Centre"],
  ["/admin/reviews-and-questions", "Reviews & Q&A"],
  ["/admin/marketing/coupons", "Marketing"],
  ["/admin/reports", "Sales analytics"],
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="admin-navigation-card">
      <div className="admin-navigation-header">
        <div>
          <span className="admin-navigation-kicker">Bridgecare Admin</span>
          <strong>Control centre</strong>
        </div>
        <Link href="/" className="admin-storefront-link" target="_blank">
          View storefront
        </Link>
      </div>

      <nav className="admin-nav unified-admin-nav" aria-label="Admin navigation">
        <div className="admin-nav-links">
          {links.map(([href, label]) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={active ? "active" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <form action="/api/admin/logout" method="post" className="admin-signout-form">
          <button type="submit" className="admin-signout-button">Sign out</button>
        </form>
      </nav>
    </div>
  );
}
