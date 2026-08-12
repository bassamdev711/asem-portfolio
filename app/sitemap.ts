import type { MetadataRoute } from "next";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/cv`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return staticPages;
    }

    const supabase = await createServiceSupabaseClient();

    const { data: projects } = await supabase
      .from("projects")
      .select("slug, updated_at")
      .eq("is_published", true);

    const projectPages: MetadataRoute.Sitemap = (projects ?? []).map((project) => ({
      url: `${siteUrl}/projects/${project.slug}`,
      lastModified: new Date(project.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    return [...staticPages, ...projectPages];
  } catch {
    return staticPages;
  }
}
