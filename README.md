# The Daily Wire Desk — News Platform

A free, publicly-hostable news website you run yourself: publish articles, manage
authors, attribute sources, embed YouTube videos, moderate comments, and collect
newsletter signups — all from a built-in admin panel. Every service used to run this
for free (locally and live on the internet) requires **no credit card, anywhere.**

**Stack:** Next.js 16 (App Router) · Turso (a free, hosted SQLite-compatible database
— also runs as a plain local file for development, same code either way) · Tailwind CSS.

---

## 1. Running it on your own computer

**Requirements:** Node.js 18+ (you're on Node 24, which works great). Get it free from
https://nodejs.org.

```bash
# 1. Unzip this project, then open a terminal inside the folder
cd newsapp

# 2. Install dependencies (one-time)
npm install

# 3. Start the site
npm run dev
```

Open **http://localhost:3000** — your site is live locally.

Open **http://localhost:3000/admin/login** to sign in to the admin panel:

- Email: `admin@example.com`
- Password: `changeme123`

**Change this password immediately** — see section 4.

Locally, with no extra setup, your data is stored in a file at `data/news.db` (created
automatically on first run). Once you deploy publicly (section 5), you'll point the
same code at a free hosted Turso database instead — nothing else changes.

---

## 2. Adding your own news (day-to-day use)

1. Go to `/admin/articles/new`
2. Write your title, summary, and body (Markdown is supported: `**bold**`, `## headings`, etc.)
3. Add a cover image — paste an image URL, or click "Upload" to upload a photo from
   your computer (stored directly with the article, no separate file storage needed)
4. Optionally paste a YouTube URL to embed a video in the article
5. Pick a category and author, add tags, and fill in the source-attribution fields if
   the story is based on another outlet's reporting
6. Set **Status** to `Published`, tick **Featured** to put it in the homepage hero, or
   **Breaking** to put it in the scrolling ticker
7. Click **Publish / Save**

It's live immediately at a URL like `/article/your-title-here`, with a sitemap entry,
RSS entry, and schema.org markup for search engines added automatically.

Manage categories at `/admin/categories`, moderate comments at `/admin/comments`,
and view newsletter subscribers (with CSV export) at `/admin/subscribers`.

**Note on images:** uploaded photos are stored inline with the article (as base64),
capped at 2MB each, so there's no separate file storage to manage or lose — but keep
photos reasonably sized (a typical web photo is 100–500KB). For very large images,
paste an external image URL instead.

---

## 3. Adding more authors/editors

There's no "add user" UI yet. To add another author, you'll run one command against
your database — see section 5 for how to get a database connection open once you're
set up with Turso, then:

```bash
node -e "
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/news.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
(async () => {
  const hash = bcrypt.hashSync('their-password-here', 10);
  await client.execute({
    sql: 'INSERT INTO users (name, email, password_hash, role, bio) VALUES (?, ?, ?, ?, ?)',
    args: ['Author Name', 'author@example.com', hash, 'author', 'Short bio here'],
  });
  console.log('User added.');
})();
"
```

Run this locally with `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` set as environment
variables (same values you'll put on Render — see section 5) to add a user to your
*live* site, or without them to add a user to your local dev database.

They can then sign in at `/admin/login`. Note: every signed-in user currently has full
admin access — there's no permission split yet between Admin/Editor/Author.

---

## 4. Changing the admin password

Same approach as above — run this locally (with `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`
set as environment variables if you're updating your live site, or without them for
local dev):

```bash
node -e "
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:./data/news.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});
(async () => {
  const hash = bcrypt.hashSync('YOUR-NEW-PASSWORD', 10);
  await client.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE email = ?',
    args: [hash, 'admin@example.com'],
  });
  console.log('Password updated.');
})();
"
```

---

## 5. Deploying so the public can read your articles (free, no credit card)

This needs two free accounts — a database (Turso) and a place to run the app (Render).
Neither asks for a credit card.

### Step A — Create your free database (Turso)

1. Go to **https://turso.tech** and sign up (GitHub login is easiest) — no card required.
2. In the Turso dashboard, create a new database (any name, e.g. `wire-desk`).
3. Once created, find:
   - The **database URL** (looks like `libsql://wire-desk-yourname.turso.io`)
   - A **auth token** (there's a "Create Token" or similar button in the database
     settings — copy the generated token)
4. Keep both values handy for Step B.

### Step B — Push this project to GitHub

1. Create a free GitHub account if you don't have one (https://github.com — no card).
2. Create a new repository and push this `newsapp` folder to it. If you're not
   comfortable with git commands, GitHub Desktop (https://desktop.github.com) lets you
   do this by dragging the folder in and clicking "Publish."

### Step C — Deploy on Render

1. Go to **https://render.com** and sign up (GitHub login is easiest) — no card required.
2. Click **New +** → **Web Service**, and connect the GitHub repository from Step B.
3. Configure it:
   - **Root Directory:** `newsapp` (if your repo root *is* the newsapp folder, leave blank)
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - **Instance Type:** Free
4. Under **Environment Variables**, add:
   - `TURSO_DATABASE_URL` — the URL from Step A
   - `TURSO_AUTH_TOKEN` — the token from Step A
   - `AUTH_SECRET` — any long random string you make up (signs admin login sessions)
   - `NEXT_PUBLIC_SITE_URL` — you'll get your Render URL after the first deploy (e.g.
     `https://the-daily-wire-desk.onrender.com`); add/update this variable once you know it
5. Click **Create Web Service**. Render will build and deploy — the first deploy takes
   a few minutes.

That's it — your site is live at whatever `.onrender.com` URL Render assigns (or a
custom domain if you add one later, also free to connect). Share that link anywhere;
anyone can open it and read your articles.

**One tradeoff to know about:** Render's free web services "sleep" after 15 minutes
with no visitors, and take about 30–60 seconds to wake back up on the next visit. Your
articles and data are completely unaffected by this (they live safely in Turso) — it
only means the very first visitor after a quiet period waits a little longer for the
page to load. If that matters to you later, Render's paid tier ($7/month) removes the
sleep behavior; everything else about this setup stays free either way.

### Publishing after deploy

Go to `https://your-app-name.onrender.com/admin/login`, sign in, and publish — same
workflow as local.

### Redeploying after you make code changes

Push to GitHub — Render redeploys automatically on every push to your main branch.

---

## 6. What's included

- Homepage: breaking-news ticker, featured hero, latest news grid, trending sidebar
- Article pages: source attribution, YouTube embeds, author bio box, related stories,
  moderated comments, social share buttons, NewsArticle schema.org JSON-LD
- Category archive pages, author archive pages, full-text search
- About / Contact / Privacy pages (edit placeholder text in `src/app/about/page.js`,
  `contact/page.js`, `privacy/page.js`)
- RSS feed per category at `/rss/<category-slug>` (or `/rss/all`)
- Auto-generated `/sitemap.xml`
- Dark mode / light mode toggle
- Admin panel: dashboard with stats, article editor (Markdown + image upload +
  YouTube + source fields + featured/breaking/status), category manager, comment
  moderation, subscriber list with CSV export

## 7. What's NOT included yet (out of scope for a generated codebase)

These need real infrastructure, paid accounts, or app-store submissions — flag if you
want help scaffolding any of them next:

- Native Android/iOS apps (needs Flutter/React Native + Xcode/Android Studio + app
  store developer accounts)
- Push notifications (needs a Firebase project)
- AdSense / social auto-posting to Twitter, Facebook, Instagram (needs your API keys
  and app approvals from each platform)
- AMP pages, full GDPR/CCPA compliance tooling, CDN setup
- A visual WYSIWYG editor (currently Markdown in a text box — simpler and more
  reliable; can add a rich-text toolbar on request)
- Role-based permission differences between Admin/Editor/Author (currently any
  signed-in user has full access)
- Paywall/subscriptions, affiliate links, donation system
- AI-powered summarization/content suggestions
- Always-on hosting with zero sleep delay (possible for free with more moving parts,
  or for $7/month with none — ask if you want this)

## 8. Project structure

```
src/
  app/            → pages and API routes (Next.js App Router)
    admin/        → admin panel pages
    api/          → API routes (public + /api/admin/* protected)
    article/, category/, author/, search/  → public pages
  components/     → shared React components
  lib/
    db.js         → Turso/libSQL connection, schema creation, seed data
    queries.js    → all database read queries
    auth.js       → session/cookie helpers
data/news.db      → local dev database (created on first run; not used in production)
```

Optional `Dockerfile` is included for anyone who prefers Docker-based hosting (e.g.
Render's "Docker" runtime, or Fly.io) — not required for the Render setup above.


