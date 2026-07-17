// Pings the IndexNow API (Bing, Yandex, Naver, Seznam.cz, Yep — NOT Google,
// which has never joined the IndexNow protocol) with every URL currently
// listed in the site's own sitemap.xml.
//
// Deliberately reads the URL list FROM the live sitemap rather than
// hardcoding it here: sitemap.ts (app/sitemap.ts) is the single real
// source of truth for "what pages exist", generated from lib/routes.ts.
// This script just consumes that output, so there's nothing to keep in
// sync by hand when a new tool page is added later — add it to
// lib/routes.ts once, and both the sitemap and this script pick it up.
//
// Run with: node scripts/indexnow-ping.mjs
// (invoked automatically by .github/workflows/indexnow.yml on every push
// to main)

const SITE_URL = "https://fancycraft.vercel.app";
const INDEXNOW_KEY = "c0cba7e7b0c090dadfe3d12a56a90e81";
const KEY_LOCATION = `${SITE_URL}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const MAX_ATTEMPTS = 5;
const RETRY_DELAY_MS = 20_000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchSitemapUrls() {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(SITEMAP_URL, { cache: "no-store" });
      if (!res.ok) throw new Error(`sitemap.xml responded with HTTP ${res.status}`);
      const xml = await res.text();
      const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1].trim());
      if (urls.length === 0) throw new Error("sitemap.xml parsed but contained no <loc> entries");
      return urls;
    } catch (err) {
      console.warn(`[indexnow] attempt ${attempt}/${MAX_ATTEMPTS} failed to fetch sitemap: ${err.message}`);
      if (attempt === MAX_ATTEMPTS) throw err;
      // A fresh push may still be mid-deploy on Vercel — wait and retry
      // rather than submitting a stale/empty URL list.
      await sleep(RETRY_DELAY_MS);
    }
  }
  return [];
}

async function submitToIndexNow(urlList) {
  const body = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  // IndexNow returns 200 (or 202) on success; it does not echo back which
  // engines picked it up — that's inherent to the protocol, not a gap in
  // this script.
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`IndexNow submission failed: HTTP ${res.status} ${text}`);
  }

  return res.status;
}

async function main() {
  console.log(`[indexnow] fetching URL list from ${SITEMAP_URL}`);
  const urlList = await fetchSitemapUrls();
  console.log(`[indexnow] submitting ${urlList.length} URLs:`);
  urlList.forEach((url) => console.log(`  - ${url}`));

  const status = await submitToIndexNow(urlList);
  console.log(`[indexnow] submitted successfully (HTTP ${status}).`);
  console.log("[indexnow] Note: this reaches Bing, Yandex, Naver, Seznam.cz, and Yep.");
  console.log("[indexnow] Google does not participate in IndexNow — it still relies on");
  console.log("[indexnow] sitemap.xml + normal crawling + Search Console, unaffected by this script.");
}

main().catch((err) => {
  console.error("[indexnow] failed:", err.message);
  process.exit(1);
});
