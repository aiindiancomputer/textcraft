import { NextResponse } from "next/server";
import { TOOL_ROUTES, absoluteUrl } from "@/lib/routes";
import { SITE_URL } from "@/lib/seo";

// Manual-trigger version of scripts/indexnow-ping.mjs, for testing without
// waiting for a git push (visit /api/indexnow in a browser or curl it).
// The GitHub Action is what makes submission automatic on every push —
// this route is a convenience, not a replacement for it.
const INDEXNOW_KEY = "c0cba7e7b0c090dadfe3d12a56a90e81";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

export async function GET() {
  const urlList = [absoluteUrl("/"), ...TOOL_ROUTES.map((route) => absoluteUrl(route.path))];

  const body = {
    host: new URL(SITE_URL).host,
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList,
  };

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });

    return NextResponse.json({
      submitted: urlList,
      indexNowStatus: res.status,
      ok: res.ok,
      note:
        "This reaches Bing, Yandex, Naver, Seznam.cz, and Yep only. Google does not " +
        "participate in IndexNow — it relies on sitemap.xml, crawling, and Search Console instead.",
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error submitting to IndexNow" },
      { status: 500 }
    );
  }
}
