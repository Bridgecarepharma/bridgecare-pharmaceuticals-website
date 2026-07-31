import { redirect } from "next/navigation";
import {
  getAdminConfiguration,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const messages: Record<string, string> = {
  invalid: "Incorrect password. Please try again.",
  rate: "Too many sign-in attempts. Please wait about 15 minutes and try again.",
  config:
    "Admin access is not configured yet. Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Netlify, then redeploy.",
};

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) redirect("/admin");
  const { error = "" } = await searchParams;
  const configuration = getAdminConfiguration();
  const message = messages[error] || "";

  return (
    <section className="admin-login-shell">
      <form className="admin-login-card" action="/api/admin/login" method="post">
        <span className="eyebrow">Bridgecare operations</span>
        <h1>Admin sign in</h1>
        <p>Use the private administrator password configured in Netlify.</p>
        {!configuration.ready ? (
          <div className="admin-config-warning" role="alert">
            <strong>Setup required</strong>
            <span>
              Create both <code>ADMIN_PASSWORD</code> and <code>ADMIN_SESSION_SECRET</code>
              in Netlify, then trigger a fresh deployment.
            </span>
          </div>
        ) : null}
        {message ? <div className="admin-error" role="alert">{message}</div> : null}
        <label>
          Password
          <input
            type="password"
            name="password"
            required
            minLength={8}
            autoComplete="current-password"
            disabled={!configuration.ready}
          />
        </label>
        <button className="button full" type="submit" disabled={!configuration.ready}>
          Sign in
        </button>
        <p className="admin-login-help">
          The password is never stored in the browser or committed to GitHub.
        </p>
      </form>
    </section>
  );
}
