# Rohan Subhash Deshmukh — Official Website

Bilingual (Marathi / English) website with a built-in admin panel.

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · next-intl |
| Backend / Admin (CMS) | Payload CMS 3 (runs inside the same Next.js app at `/admin`) |
| Database | PostgreSQL (local, or Neon / Supabase / any hosted Postgres) |
| Media storage | Local `/media` folder in development · Vercel Blob in production |
| Email | Resend (form notifications + auto-acknowledgement) |
| Spam protection | Google reCAPTCHA v3 + honeypot + rate limit |

---

## 1. Run it on your computer (Windows / macOS / Linux)

**Requirement:** Node.js 20.9+ (22 LTS recommended). **No PostgreSQL install or account needed:**
the project ships its own private PostgreSQL server (stored in the `.postgres-data` folder).

On Windows just double-click:

| File | Mode | Use it for |
|---|---|---|
| `start-website.bat` | **Fast / production** (`npm run preview`) | Viewing and managing the site — pages load instantly. Rebuilds automatically (2–5 min) only after code changes. |
| `start-dev.bat` | Development (`npm run dev`, Turbopack) | Editing code — changes appear instantly, but each page compiles on its first visit. |

Run only one of them at a time. On macOS/Linux: `npm install`, `cp .env.example .env`, then `npm run preview` or `npm run dev`.
The first run sets up the database and loads all content and photos from the current site (2–4 minutes).

Open:
- Website → http://localhost:3000 (Marathi) and http://localhost:3000/en (English)
- Admin panel → http://localhost:3000/admin — **admin@rohandeshmukh.in / ChangeMe@123** (change it after first login)

Other commands (run in a second terminal while the site is running):
- `npm run seed:fresh` — delete all content and load it again from the current site
- `npm run db` — start only the database

Port 5432 already used? Change it in `DATABASE_URI` (e.g. `localhost:5433`).
To use your own PostgreSQL or a cloud database (Neon) instead, put its URL in `DATABASE_URI`; for a local server also add `USE_EMBEDDED_DB=false`.

## 2. Deploy to Vercel

1. Create a Postgres database (e.g. **Neon** from the Vercel Marketplace) and a **Vercel Blob** store.
2. Add these environment variables in Vercel → Settings → Environment Variables:
   `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://rohandeshmukh.in`,
   `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`,
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `NEXT_PUBLIC_GA_ID`.
3. Set **Build Command** to `npm run ci`, which runs the database migrations and then the build.
4. Deploy. Then run the seed once against the production database: put the production `DATABASE_URI` and `BLOB_READ_WRITE_TOKEN` in your local `.env` and run `npm run seed`.

When you change collections or fields, run `npm run migrate:create` locally and commit the new file in `src/migrations`.

## 3. What the admin team can manage

| Admin menu | What it controls |
|---|---|
| Content → **Homepage** | Every homepage section: slider, quick links, about, video, initiatives, family, photo strip, counters, FAQs, blog, social feeds. Drag to reorder; tick **hidden** to hide one. |
| Content → **Pages** | Biography, Party & Organisation, Lokmangal Foundation / Parivar / Vishwamangal, Constituency, Political Career, Vision, Appeal and the legal pages. Pages are built from blocks: text, image + text, counters, cards, gallery, FAQ, video, quote, downloads, call to action. |
| Social Work | Initiatives (category, counters, gallery, video, related posts) and Events (year-wise galleries). |
| Blog | Posts (drafts and scheduled publishing), categories, tags. |
| Media | Photos (automatic WebP and thumbnails, folders, bulk upload), PDFs, photo albums, YouTube videos, official download photos. |
| About | Awards, thoughts / quotes, meetings with leaders. |
| Inbox | Contact messages, grievances and suggestions (with reference numbers), job applications. Filter by status and export to CSV. |
| Settings | Site settings (logo, contact, social links, header button, #ConnectWithRohan tag, form email recipients), **Menu** (3-level mega menu), Footer, **Popup** (on/off, image, link, date range), Offices, Users and roles. |

**Roles:** Super Admin (everything, including users) · Editor (all content and the inbox) · Media Uploader (photos, albums, videos, quotes).

**Language:** use the locale switcher at the top of any edit screen (मराठी / English). If an English field is empty, the site shows the Marathi text.

## 4. Project structure

```
src/
  app/(frontend)/[locale]/   website pages (mr = /, en = /en)
  app/(payload)/             admin panel + REST/GraphQL API
  collections/  globals/     CMS schema
  blocks/                    page & homepage section blocks
  components/                UI (layout, home sections, blocks, forms)
  lib/                       data helpers, form server actions
  i18n/                      routing + UI strings (messages/mr.json, en.json)
  seed/                      content import from the current website
  migrations/                database migrations for production
```

## 5. Sections intentionally not included

The following are left out of this build, as marked in the requirements document:

- Homepage: citizen-engagement strip, press-note slider, achievements block, political-journey timeline, newsletter.
- About: Journey timeline, People's Connect wall.
- Constituency section (district pages, work report, voices, monthly reports) and Political Career sub-pages. The existing overview pages are kept as simple content pages.
- Media: News Coverage, Print Media, Press Releases.
- Volunteer form on Appeal, Daily Programme (Daura), Newsletter.
