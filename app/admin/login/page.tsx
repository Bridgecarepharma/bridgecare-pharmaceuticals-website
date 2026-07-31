import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const message =
    error === "invalid"
      ? "The password is incorrect."
      : error === "not-configured"
        ? "ADMIN_PASSWORD has not been configured in Netlify."
        : null;

  return (
    <section className="section admin-shell">
      <div className="container admin-login-wrap">
        <div className="admin-login-card">
          <span className="eyebrow">Bridgecare operations</span>
          <h1>Admin sign in</h1>
          <p>Use the private admin password configured in Netlify.</p>
          {message ? <div className="admin-alert">{message}</div> : null}
          <form action="/api/admin/login" method="post" className="form">
            <label>
              Admin password
              <input name="password" type="password" autoComplete="current-password" required />
            </label>
            <button className="button" type="submit">Sign in</button>
          </form>
        </div>
      </div>
    </section>
  );
}
