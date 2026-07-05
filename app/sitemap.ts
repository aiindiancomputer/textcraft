import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://fancycraft.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Agar future me tum dusre pages banate ho (jaise /about ya /blog), 
    // toh unhe bhi tum isi tarah niche list me add kar sakte ho.
  ];
}