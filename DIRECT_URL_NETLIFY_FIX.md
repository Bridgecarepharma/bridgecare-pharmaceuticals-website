# Netlify Prisma migration timeout fix

The app uses two Supabase PostgreSQL URLs:

- `DATABASE_URL`: Supabase transaction pooler URL, normally port `6543`, used by the deployed application.
- `DIRECT_URL`: Supabase session/direct URL shown in **Supabase → Connect → ORMs → Prisma**, normally port `5432`, used by Prisma migrations.

Add both values in Netlify as secret environment variables with Builds, Functions, and Runtime scopes. Do not include `DATABASE_URL=` or quotation marks in the value field.

The Prisma datasource now contains:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

Then choose **Deploy project without cache**.
