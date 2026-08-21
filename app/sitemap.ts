import type { MetadataRoute } from "next";
import { staticProjects } from "@/lib/static-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asem-portfolio-nine.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/cv`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const projectPages: MetadataRoute.Sitemap = staticProjects
    .filter((project) => project.is_published)
    .map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...projectPages];
}
