import type { Metadata } from "next";
import { ProjectsFilter } from "@/components/projects-filter";
import { generatePageMetadata } from "@/lib/seo";
import { staticProjects } from "@/lib/static-data";

export const metadata: Metadata = generatePageMetadata({
  title: "Projects",
  description:
    "Browse Asem Alhakim's projects showcasing web development, mobile apps, IT systems, and technical solutions.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold md:text-5xl">
            My <span className="gradient-text">Projects</span>
          </h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            A collection of projects spanning web development, mobile applications,
            infrastructure, and digital operations.
          </p>
        </div>

        <ProjectsFilter projects={staticProjects} />
      </div>
    </section>
  );
}
