import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

// Always render this page at request time so authentication state is current.
export const dynamic = "force-dynamic";
export const revalidate = 0;

const messages: Record<string, string> = {
  invalid: "Incorrect password. Please try again.",
  rate: "Too many sign-in attempts. Please wait about 15 minutes and try again.",
  config:
    "Admin access is not configured on the server. Confirm ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Netlify, then redeploy.",
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");

  const { error = "" } = await searchParams;
  const message = messages[error] || "";

  return (
    <section className="admin-login-shell">
      <form className="admin-login-card" action="/api/admin/login" method="post">
        <span className="eyebrow">Bridgecare operations</span>
        <h1>Admin sign in</h1>
        <p>Use the private administrator password configured in Netlify.</p>

        {message ? (
          <div className="admin-error" role="alert">
            {message}
          </div>
        ) : null}

        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            autoFocus
          />
        </label>

        <button className="button full" type="submit">
          Sign in
        </button>

        <p className="admin-login-help">
          The password is never stored in the browser or committed to GitHub.
        </p>
      </form>
    </section>
  );
}
