import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_APP_URL || "https://adscore.ai";
  const now  = new Date();

  const publicPages: MetadataRoute.Sitemap = [
    { url: base,              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${base}/signup`,  lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/login`,   lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/about`,   lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/help`,    lastModified: now, changeFrequency: "weekly",  priority: 0.6 },
    { url: `${base}/blog`,    lastModified: now, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${base}/changelog`,lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${base}/terms`,   lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  return publicPages;
}
