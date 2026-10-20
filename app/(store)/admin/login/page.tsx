import { redirect } from "next/navigation";
import { getAdminConfiguration, isAdminAuthenticated } from "@/lib/admin-auth";

export const metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const messages: Record<string, string> = {
  invalid: "Incorrect password. Please try again.",
  rate: "Too many sign-in attempts. Please wait about 15 minutes and try again.",
  config:
    "This deployment cannot see the admin environment variables. Confirm that ADMIN_PASSWORD and ADMIN_SESSION_SECRET are configured on the same Netlify project that owns this URL, then redeploy.",
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
  const deploymentName = process.env.SITE_NAME || "this Netlify site";
  const deploymentUrl = process.env.DEPLOY_URL || process.env.URL || "the current deployment";

  return (
    <section className="admin-login-shell">
      <form className="admin-login-card" action="/api/admin/login" method="post">
        <span className="eyebrow">Bridgecare operations</span>
        <h1>Admin sign in</h1>
        <p>Use the private administrator password configured in Netlify.</p>

        {!configuration.ready ? (
          <div className="admin-error" role="alert">
            <strong>Setup required for {deploymentName}.</strong>
            <br />
            This deployment cannot read both admin variables. Configure them on the Netlify project serving <code>{deploymentUrl}</code>, then clear the deploy cache and redeploy.
          </div>
        ) : null}

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
          Configuration check: password {configuration.passwordConfigured ? "✓" : "✗"} · session secret {configuration.sessionSecretConfigured ? "✓" : "✗"}
        </p>
      </form>
    </section>
  );
}
