import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { TOOL_ROUTES } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolEntries: MetadataRoute.Sitemap = TOOL_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...toolEntries,
  ];
}
