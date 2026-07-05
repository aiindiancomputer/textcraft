# TextCraft — Modern Text Utility Hub

A single-page, 100% client-side text utility dashboard built with Next.js (App
Router), Tailwind CSS, and Lucide React. No backend, no database — safe to
deploy permanently on Vercel's free Hobby plan.

## Tools included

1. **Case Converter Studio** — UPPERCASE, lowercase, Title Case, Sentence
   case, InVeRsE cAsE, and slugify, with a live word/character/sentence
   counter.
2. **Fancy Text & Gaming Nickname Generator** — 237 total styles: 42 Unicode
   font/novelty transforms (bold, italic, script, gothic, double-struck,
   small caps, superscript, subscript, circled, squared, parenthesized,
   upside-down, strike/underline/dotted/wavy overlays, separators, and
   more), 111 decorative gaming-name frames (swords, crowns, stars, hearts,
   skulls, brackets, and more), and 84 curated font + frame combos —
   searchable by name, filterable by category, with per-row copy buttons.
3. **Deep Text Analytics & Insights** — character/word/sentence/paragraph
   counts plus estimated reading time (200 wpm) and speaking time (130 wpm).
4. **Pro Text Cleaner & Spacer** — remove extra spaces, remove empty lines,
   strip HTML tags, and remove emojis.

Also included: a light/dark theme toggle (persisted in `localStorage`), an
SEO-friendly FAQ accordion, semantic HTML landmarks, and two AdSense-ready
placeholder slots (sidebar + bottom of the main panel).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Keep the default Next.js build settings — no environment variables are
   required.
4. Deploy. The Hobby plan is sufficient since there is no server-side
   compute, database, or API route.

## Project structure

```
app/
  layout.tsx        # Root layout + SEO metadata
  page.tsx           # Page shell: sidebar, tool switching, toast, FAQ
  globals.css         # Theme tokens (light/dark) and base styles
components/
  Sidebar.tsx         # Branding, nav, theme toggle, sidebar ad slot
  AdPlaceholder.tsx    # Reusable AdSense-ready placeholder card
  Toast.tsx            # Inline copy/clear feedback toast
  CaseConverter.tsx
  FancyTextGenerator.tsx
  TextAnalytics.tsx
  TextCleaner.tsx
  FAQSection.tsx
lib/
  textUtils.ts         # All conversion, analytics, cleaning, and Unicode logic
  types.ts
```

## Adding a real AdSense unit

Each `<AdPlaceholder />` is a plain styled `<div>`. To go live, swap its
contents for your AdSense `<ins>` snippet and load the AdSense script in
`app/layout.tsx`.
