import Link from "next/link";

export function AdminNav() {
  return (
    <nav className="admin-nav" aria-label="Admin navigation">
      <Link href="/admin">Dashboard</Link>
      <Link href="/admin/orders">Orders</Link>
      <Link href="/admin/customers">Customers</Link>
      <Link href="/admin/products">Products & stock</Link>
      <Link href="/admin/prices">Prices</Link>
      <Link href="/admin/reports">Reports</Link>
      <form action="/api/admin/logout" method="post">
        <button type="submit">Sign out</button>
      </form>
    </nav>
  );
}
