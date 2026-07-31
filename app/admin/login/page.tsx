export const metadata = { title: "Admin Login" };
export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return <section className="admin-login-shell"><form className="admin-login-card" action="/api/admin/login" method="post">
    <span className="eyebrow">Bridgecare operations</span><h1>Admin sign in</h1>
    <p>Use the private administrator password configured in Netlify.</p>
    {error ? <div className="admin-error">Incorrect password. Please try again.</div> : null}
    <label>Password<input type="password" name="password" required autoComplete="current-password" /></label>
    <button className="button full" type="submit">Sign in</button>
  </form></section>;
}
