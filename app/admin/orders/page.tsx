import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Admin Orders",
  robots: { index: false, follow: false },
};

function naira(kobo: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(kobo / 100);
}

export default async function AdminOrdersPage() {
  await requireAdmin();

  const orders = process.env.DATABASE_URL
    ? await prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
        include: { items: true, payment: true },
      })
    : [];

  return (
    <section className="section admin-shell">
      <div className="container">
        <div className="admin-heading">
          <div>
            <span className="eyebrow">Bridgecare operations</span>
            <h1>Orders</h1>
            <p>Latest 100 checkout orders and their payment status.</p>
          </div>
          <form action="/api/admin/logout" method="post">
            <button className="button secondary" type="submit">Sign out</button>
          </form>
        </div>

        {!process.env.DATABASE_URL ? (
          <div className="admin-alert">DATABASE_URL is not configured.</div>
        ) : orders.length === 0 ? (
          <div className="admin-empty">No orders have been recorded yet.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Order status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.orderNumber}</strong>
                      <small>{order.paystackReference}</small>
                    </td>
                    <td>
                      <strong>{order.customerName}</strong>
                      <small>{order.customerEmail}</small>
                      <small>{order.customerPhone}</small>
                    </td>
                    <td>
                      {order.items.map((item) => (
                        <small key={item.id}>{item.quantity} × {item.productName}</small>
                      ))}
                    </td>
                    <td><strong>{naira(order.totalKobo)}</strong></td>
                    <td>
                      <span className={`admin-status status-${(order.payment?.status || "PENDING").toLowerCase()}`}>
                        {order.payment?.status || "PENDING"}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-status status-${order.status.toLowerCase().replaceAll("_", "-")}`}>
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>
                    <td>{new Intl.DateTimeFormat("en-NG", { dateStyle: "medium", timeStyle: "short" }).format(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
