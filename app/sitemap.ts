import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { TOOL_METADATA } from "@/lib/toolMetadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const toolEntries: MetadataRoute.Sitemap = Object.values(TOOL_METADATA).map((tool) => ({
    url: `${SITE_URL}${tool.path}`,
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
