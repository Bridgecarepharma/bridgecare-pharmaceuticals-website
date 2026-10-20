# Deploy fix: duplicate App Router pages

Uploading a ZIP over an existing GitHub repository adds the new `(store)` pages but does not delete their old `app/` counterparts. Next.js sees both sets of pages at the same URLs.

This update keeps the separate verification layout and adds `scripts/prepare-store-routes.mjs` to the existing build command. Before Prisma generation and Next.js compilation, it moves only old page files with a matching `(store)` page outside the App Router into `.bridgecare-route-backup/`, retaining their contents as `.bak` files. It does not remove old component files, API routes, the verification page, database tables or custom pages without a matching group page. Repeated builds are safe. The backup directory is ignored by Git and its `.bak` files are not TypeScript inputs. On Netlify this operates in the build checkout, not your GitHub repository.

## Upload and redeploy

1. Extract this ZIP.
2. Upload its contents to the existing repository root, replacing matching files. Include the new script, updated `package.json` and the full `app/(store)` folder. Do not create an extra enclosing directory.
3. Commit the upload. Netlify uses the existing build command. Look for `Store routes ready` before `next build` in the log.
4. Confirm `/verify` has no prices or shopping links, and shopping/admin still work on the main domain.

You do not need to manually delete 51 routes or reset the database. The group folders remain in this version; the build automatically handles leftover page files from earlier uploads. For a permanently tidy repository, its legacy duplicate page files can later be removed in a Git commit after reviewing the backups.

The verification subdomain still requires the separate steps in `VERIFICATION_SUBDOMAIN_SETUP.md`. Keep `VERIFICATION_SITE_URL` unset until the subdomain works with HTTPS.
