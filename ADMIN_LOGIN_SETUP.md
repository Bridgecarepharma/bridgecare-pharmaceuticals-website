# Bridgecare Admin Login Setup

Create both variables in Netlify under **Site configuration → Environment variables**.

```text
ADMIN_PASSWORD=<your private password, at least 12 characters recommended>
ADMIN_SESSION_SECRET=<a separate random secret, at least 32 characters>
```

The variable **key** is the name on the left. The secret belongs in the **value** field.

Recommended Netlify settings:

- Scope: All scopes
- Value: Same value for all deploy contexts, unless staging should use a separate password
- Mark both values as secrets where available

After saving, trigger **Clear cache and deploy site**.

Login URL:

```text
https://bridgecarepharmang.netlify.app/admin/login
```

The login now:

- refuses access when either variable is missing;
- uses constant-time password comparison;
- stores an eight-hour signed HTTP-only cookie;
- redirects authenticated admins away from the login page;
- rate-limits repeated failed attempts on a best-effort basis;
- gives a clear setup message instead of silently failing.
