# Bridgecare Health Centre CMS v6.1.0

## New admin publishing tools

- Added `/admin/health-centre` for article management.
- Added article creation and editing with draft, published and archived states.
- Added a lightweight formatting toolbar for headings, paragraphs, emphasis, quotes, lists and links.
- Added category management at `/admin/health-centre/categories`.
- Added comma-separated tags, featured articles, author details, featured-image URLs and SEO fields.
- Added audit-log records for article creation, updates and deletion.

## Public Health Centre improvements

- Published CMS articles now appear automatically on `/health-centre`.
- Existing code-based articles remain available as a safe fallback until the first CMS article is published.
- Added article search and category filtering.
- Added article bylines, reading-time estimates, featured images, tags, related articles and sharing links.
- Added dynamic metadata, Article JSON-LD and dynamic sitemap entries.
- The homepage now displays the latest three published Health Centre articles.

## Database migration

The release adds:

- `HealthArticle`
- `HealthCategory`
- `HealthTag`
- `HealthArticleTag`
- `ArticleStatus`

Netlify runs `prisma migrate deploy` before the production build, so the migration is applied automatically when the required database environment variables are available.

## Publishing notes

- Featured images currently use a public HTTPS image URL. A managed media uploader can be added in a later release.
- Article HTML is restricted by removing scripts, iframes, inline event handlers and `javascript:` URLs before saving.
- Health content should remain evidence-informed and should include the standard educational disclaimer.
