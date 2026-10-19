# Rohan Subhash Deshmukh — Official Website

English website with an admin panel, built as a **three-tier application**:

```
  Browser
     │
     ▼
┌───────────────┐   REST API (HTTP)   ┌───────────────┐       SQL       ┌───────────────┐
│   frontend/   │ ──────────────────▶ │   backend/    │ ──────────────▶ │     db/       │
│ public website│ ◀── cache refresh ──│ Payload CMS   │                 │  PostgreSQL   │
│  port 3000    │      (webhook)      │ admin + API   │                 │  port 5432    │
└───────────────┘                     │  port 3001    │                 └───────────────┘
 presentation tier                    └───────────────┘                    data tier
                                       application tier
```

| Tier | Folder | Technology | Talks to |
|---|---|---|---|
| Presentation | `frontend/` | Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · next-intl | the backend's REST API only — never the database |
| Application | `backend/` | Payload CMS 3 on Next.js — admin panel `/admin`, REST/GraphQL API `/api`, contact form endpoint, schema, migrations, seed | the database |
| Data | `db/` | PostgreSQL (private embedded server locally, Docker optional, Neon / any hosted Postgres in production) | — |

| Other | |
|---|---|
| Media storage | `backend/media` in development · Vercel Blob in production (served to visitors under the website's own `/api/media/…`) |
| Email | Resend (form notifications + auto-acknowledgement), sent by the backend |
| Spam protection | Google reCAPTCHA v3 + honeypot + rate limit, checked by the backend |

---

## 1. Run it on your computer (Windows / macOS / Linux)

**Requirement:** Node.js 20.9+ (22 LTS recommended). **No PostgreSQL install or account needed:**
the data tier runs its own private PostgreSQL server (stored in `db/.postgres-data`).

On Windows just double-click:

| File | Mode | Use it for |
|---|---|---|
| `start-website.bat` | **Fast / production** (`npm run preview`) | Viewing and managing the site — pages load instantly. Rebuilds automatically (2–5 min) only after code changes. |
| `start-dev.bat` | Development (`npm run dev`, Turbopack) | Editing code — changes appear instantly, but each page compiles on its first visit. |

Run only one of them at a time. On macOS/Linux: `npm install`, copy `.env.example` to `.env` in **each** of
`db/`, `backend/` and `frontend/`, then `npm run preview` or `npm run dev` from the project root.
One command starts all three tiers in order: database → backend → website.
The first run sets up the database and loads all content and photos from the current site (2–4 minutes).

Open:
- Website → http://localhost:3000
- Admin panel → http://localhost:3001/admin — **admin@rohandeshmukh.in / ChangeMe@123** (change it after first login)
- Content API → http://localhost:3001/api (e.g. `/api/pages`, `/api/globals/home`)

Other commands (from the project root, in a second terminal while the site is running):
- `npm run seed:fresh` — delete all content and load it again from the current site
- `npm run db` — start only the database
- `npm run typecheck` — type-check backend and frontend

Environment files — each tier has its own (`.env.example` lists every setting):

| File | Holds |
|---|---|
| `db/.env` | `DATABASE_URI` for the local PostgreSQL server |
| `backend/.env` | `DATABASE_URI` (same value), `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL`, `FRONTEND_URL`, `INTERNAL_API_SECRET`, email, Blob, reCAPTCHA secret |
| `frontend/.env` | `CMS_URL` (the backend), `NEXT_PUBLIC_SITE_URL`, `INTERNAL_API_SECRET` (same value), reCAPTCHA site key, GA |

Port 5432 already used? Change the port in `DATABASE_URI` in both `db/.env` and `backend/.env` (e.g. `localhost:5433`).
To use your own PostgreSQL, Docker (`db/docker-compose.yml`) or a cloud database (Neon), put its URL in `backend/.env` — the local server only starts for `localhost` addresses.

## 2. Deploy to Vercel (two projects)

The frontend and backend deploy as **two Vercel projects from the same repository**; the database is a hosted Postgres.

1. Create a Postgres database (e.g. **Neon** from the Vercel Marketplace) and a **Vercel Blob** store.
2. **Backend project** — Root Directory `backend`, Build Command `npm run ci` (migrations, then build). Environment variables:
   `DATABASE_URI`, `PAYLOAD_SECRET`, `PAYLOAD_PUBLIC_SERVER_URL` (e.g. `https://cms.rohandeshmukh.in`),
   `FRONTEND_URL=https://rohandeshmukh.in`, `INTERNAL_API_SECRET`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `EMAIL_FROM`, `RECAPTCHA_SECRET_KEY`.
3. **Frontend project** — Root Directory `frontend`, default build. Environment variables:
   `CMS_URL` (the backend's address), `NEXT_PUBLIC_SITE_URL=https://rohandeshmukh.in`, `INTERNAL_API_SECRET` (same value as the backend),
   `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `NEXT_PUBLIC_GA_ID`.
4. Deploy the **backend first** — the website reads content from it while it builds.
5. Run the seed once against the production database: put the production values in `backend/.env` and run `npm run seed`.

When you change collections or fields, run `npm run migrate:create -w backend` and commit the new file in `backend/src/migrations`,
then `npm run generate:types` so the website picks up the new types.

## 3. What the admin team can manage

| Admin menu | What it controls |
|---|---|
| Content → **Homepage** | Every homepage section: slider, about, biography, work, initiatives, video, family, photo strip, counters, blog, social feeds (quick links / FAQ blocks can be added back). Drag to reorder; tick **hidden** to hide one. |
| Content → **Pages** | Biography, Party & Organisation, Lokmangal Foundation / Parivar / Vishwamangal, Political Career, Vision, Appeal and the legal pages. Pages are built from blocks: text, image + text, counters, cards, gallery, FAQ, video, quote, downloads, call to action. |
| Social Work | Initiatives (category, counters, gallery, video, related posts) and Events (year-wise galleries). |
| Blog | Posts (drafts and scheduled publishing), categories, tags. |
| Media | Photos (automatic WebP and thumbnails, folders, bulk upload), PDFs, photo albums, YouTube videos, official download photos. |
| About | Awards, thoughts / quotes, meetings with leaders. |
| Inbox | Contact messages, grievances and suggestions (with reference numbers), job applications. Filter by status and export to CSV. |
| Settings | Site settings (logo, contact, social links, header button, #ConnectWithRohan tag, form email recipients), **Menu** (3-level mega menu), Footer, **Popup** (on/off, image, link, date range), Offices, Users and roles. |

**Roles:** Super Admin (everything, including users) · Editor (all content and the inbox) · Media Uploader (photos, albums, videos, quotes).

**Language:** the website is English only. The admin still has both languages (locale switcher at the top of any edit screen); the site shows the English version, and if an English field is empty it shows the Marathi text.

## 4. Project structure

```
package.json            npm workspaces + one-command scripts (npm run dev / preview / build)
scripts/dev.mjs         starts db → backend → frontend in order

db/                     DATA TIER
  start.mjs             private PostgreSQL server for local development (data in db/.postgres-data)
  docker-compose.yml    optional Docker alternative

backend/                APPLICATION TIER (Payload CMS, http://localhost:3001)
  src/payload.config.ts CMS configuration
  src/collections/  src/globals/  src/blocks/  src/fields/   schema
  src/endpoints/        custom API endpoints (contact form)
  src/hooks/            e.g. tell the website to refresh its cache after an edit
  src/app/(payload)/    admin panel + REST/GraphQL API routes
  src/components/admin/ admin dashboard and UI tweaks
  src/migrations/       database migrations for production
  src/seed/             content import from the current website
  src/payload-types.ts  generated content types (the website imports these types only)
  media/                uploaded files (development)

frontend/               PRESENTATION TIER (public website, http://localhost:3000)
  src/app/[locale]/     website pages
  src/app/api/revalidate/  cache refresh called by the backend
  src/components/       UI (layout, home sections, blocks, forms)
  src/lib/cms.ts        the only way to content: a client for the backend's REST API
  src/lib/forms.ts      forwards the contact form to the backend
  src/i18n/             routing + UI strings
  public/               fonts and the site's own photos
```

## 5. Sections intentionally not included

The following are left out of this build, as marked in the requirements document:

- Homepage: citizen-engagement strip, press-note slider, achievements block, political-journey timeline, newsletter.
- About: Journey timeline, People's Connect wall.
- Pune Graduate Constituency: removed from the whole site (page, menu, footer, FAQs, voter-registration links).
- Political Career sub-pages (the overview page is kept as a simple content page).
- Media: News Coverage, Print Media, Press Releases.
- Volunteer form on Appeal, Daily Programme (Daura), Newsletter.
- Removed in the Oct 2026 restructure (old links redirect to the nearest page): Achievements & Awards, Party & Organisation,
  Meetings with Leaders, Vishwamangal, Download Official Photos, Grievance / Suggestion, Careers / Volunteer, site search
  and the "Join us" header button. Their admin sections are hidden; existing data is kept.

**Menu after the restructure:** Home · About (Biography, Family, Thoughts, Social Initiatives, Political Career) ·
Lokmangal (Foundation, Parivar, Initiatives) · Events (All events, Community Weddings, New India Manifesto, Blog) ·
Gallery (Photos, Videos) · Connect (Appeal, Contact). To apply it to an existing local database run `npm run menu:update`
(the live site gets it automatically through a migration on the next deploy).
