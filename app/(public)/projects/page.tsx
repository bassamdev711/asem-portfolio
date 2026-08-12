import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ProjectsFilter } from "@/components/projects-filter";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata({
  title: "Projects",
  description:
    "Browse all my projects showcasing web development, mobile apps, and full-stack solutions built with modern technologies.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const supabase = await createServerSupabaseClient();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .eq("is_published", true)
    .order("display_order");

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of projects I&apos;ve built, from full-stack web applications
            to mobile apps and developer tools.
          </p>
        </div>

        <ProjectsFilter projects={projects ?? []} />
      </div>
    </section>
  );
}
