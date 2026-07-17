# FancyCraft — Fancy Font, Gaming Logo & Nickname Generator

A multi-page, 100% client-side text/logo utility suite built with Next.js
(App Router), Tailwind CSS, and Lucide React. No backend, no database — safe
to deploy permanently on Vercel's free Hobby plan.

Each tool is its own real, statically-generated page (not a query-param
tab), which is what makes it independently indexable — each has its own
title, meta description, canonical URL, and `<h1>`.

## Pages

| Route | Tool |
|---|---|
| `/` | Homepage — overview + links to every tool |
| `/fancy-font-generator` | 237-style fancy font & gaming nickname generator |
| `/gaming-logo-maker` | Canvas-based esports logo / gaming avatar maker |
| `/case-converter` | UPPERCASE / lowercase / Title / Sentence / slug |
| `/word-counter` | Word/character/sentence count + reading & speaking time |
| `/text-cleaner` | Strip extra spaces, empty lines, HTML tags, emojis |

Also included: light/dark theme toggle (persisted in `localStorage`), an
FAQ accordion + matching FAQPage JSON-LD, WebApplication JSON-LD, OG/Twitter
card image, and two AdSense-ready placeholder slots.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Keep the default Next.js build settings — no environment variables
   required.
4. Deploy.

## IndexNow (automatic search-engine notification on push)

`.github/workflows/indexnow.yml` runs automatically on every push to
`main`: it waits ~45s for the Vercel deploy to roll out, fetches the live
`sitemap.xml`, and submits every URL in it to the IndexNow API.

**Important — read before assuming this covers "all search engines":**
IndexNow is supported by **Bing, Yandex, Naver, Seznam.cz, and Yep**
(Yep feeds DuckDuckGo/ChatGPT Search/Copilot's index too). **Google does
not participate in IndexNow** and never has — Google still relies purely
on `sitemap.xml` (already set up, see `app/sitemap.ts`), normal crawling,
internal links, and Search Console. There is no public "ping this URL"
API for Google outside of the Indexing API, which Google restricts to
`JobPosting`/`BroadcastEvent` structured data — not applicable here.

Setup already done for you:
- IndexNow key: `c0cba7e7b0c090dadfe3d12a56a90e81`
- Key file hosted at `public/c0cba7e7b0c090dadfe3d12a56a90e81.txt`
  (served at `/c0cba7e7b0c090dadfe3d12a56a90e81.txt` — required by the
  protocol so IndexNow can verify you own the domain)
- Manual test endpoint: visit `/api/indexnow` on the deployed site to
  trigger a submission on demand, without waiting for a push

If you ever change domains, regenerate the key (any random hex string
works) and update it in three places: the key file's name+contents,
`scripts/indexnow-ping.mjs`, and `app/api/indexnow/route.ts`.

## Migrating from the old `?tool=` URLs

`next.config.js` has permanent (301) redirects from the previous
query-param URLs (`/?tool=fancy-text`, etc.) to the new dedicated pages,
so any old bookmarks or already-indexed links don't 404 or split ranking
signals across two URLs for the same content.

## Project structure

```
app/
  layout.tsx                 # Root shell: metadata, theme-init script, JSON-LD
  page.tsx                    # Homepage (static metadata, tool grid, FAQ)
  fancy-font-generator/page.tsx
  gaming-logo-maker/page.tsx
  case-converter/page.tsx
  word-counter/page.tsx
  text-cleaner/page.tsx
  api/indexnow/route.ts        # Manual IndexNow trigger
  robots.ts / sitemap.ts / manifest.ts
components/
  AppShell.tsx                 # Shared shell every tool page renders inside
  Sidebar.tsx                   # Real <Link> nav (crawlable), theme toggle
  ToastProvider.tsx              # Copy/download feedback via context
  CaseConverter.tsx / FancyTextGenerator.tsx / LogoGenerator.tsx /
  TextAnalytics.tsx / TextCleaner.tsx
  FAQSection.tsx / StructuredData.tsx / AdPlaceholder.tsx / Toast.tsx
lib/
  routes.ts                    # Single source of truth: path + metadata per tool
  textUtils.ts / logoTemplates.ts / logoMascots.ts / textArc.ts / colorUtils.ts
  faqs.ts / seo.ts / types.ts
scripts/
  indexnow-ping.mjs             # Run by the GitHub Action on every push
.github/workflows/indexnow.yml
```

## Adding a new tool page later

1. Add an entry to `TOOL_ROUTES` in `lib/routes.ts` (path, title, description).
2. Create `app/<your-path>/page.tsx` following the pattern in any existing
   tool page (static `metadata` export + `<AppShell activeTool="..."><YourComponent /></AppShell>`).
3. Add the icon to `TOOL_ICONS` in `components/Sidebar.tsx`.

`sitemap.ts`, the homepage's tool grid, the sidebar nav, and IndexNow all
read from `lib/routes.ts` — nothing else needs to be updated by hand.

## Adding a real AdSense unit

Each `<AdPlaceholder />` is a plain styled `<div>`. To go live, swap its
contents for your AdSense `<ins>` snippet and load the AdSense script in
`app/layout.tsx`.
