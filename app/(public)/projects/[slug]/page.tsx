import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Github,
  FileText,
  Calendar,
  Clock,
  User,
  Star,
} from "lucide-react";
import { staticProjects } from "@/lib/static-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectDetailAnimations } from "./project-detail-animations";
import { generateProjectSchema } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return staticProjects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = staticProjects.find((item) => item.slug === slug && item.is_published);

  if (!project) return { title: "Project Not Found" };

  return {
    title: project.meta_title || project.name,
    description: project.meta_description || `Case study for ${project.name}`,
    openGraph: {
      title: project.meta_title || project.name,
      description: project.meta_description || "",
      images: project.main_image ? [project.main_image] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = staticProjects.find((item) => item.slug === slug && item.is_published);

  if (!project) notFound();

  const images = project.gallery;
  const relatedProjects = staticProjects
    .filter((item) => item.is_published && item.category === project.category && item.id !== project.id)
    .slice(0, 3);

  const jsonLd = generateProjectSchema({
    name: project.name,
    description: project.short_description || project.description,
    slug: project.slug,
    image: project.main_image,
    technologies: project.technologies,
    startDate: project.start_date,
    endDate: project.end_date,
    githubUrl: project.github_url,
    liveUrl: project.live_url,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <Button variant="ghost" asChild className="mb-8">
            <Link href="/projects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Link>
          </Button>

          <ProjectDetailAnimations>

            <div className="relative aspect-video rounded-xl overflow-hidden mb-10 bg-muted">
              {project.main_image ? (
                <img
                  src={project.main_image}
                  alt={project.name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No image available
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              {project.is_featured && (
                <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                  <Star className="h-3 w-3 mr-1 fill-current" />
                  Featured
                </Badge>
              )}
              <Badge variant="outline">{project.category}</Badge>
              <Badge
                className={
                  project.status === "Completed"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                    : project.status === "In Progress"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    : ""
                }
              >
                {project.status}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {project.name}
            </h1>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              {project.short_description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              {project.duration && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{project.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {project.my_role && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <User className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Role</p>
                      <p className="text-sm font-medium">{project.my_role}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {project.start_date && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Started</p>
                      <p className="text-sm font-medium">
                        {new Date(project.start_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              {project.end_date && (
                <Card>
                  <CardContent className="p-4 flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Completed</p>
                      <p className="text-sm font-medium">
                        {new Date(project.end_date).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {project.technologies && project.technologies.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech: string) => (
                    <Badge key={tech} variant="secondary" className="text-sm px-3 py-1">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {project.description && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Overview</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>
              </section>
            )}

            {project.key_features && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.key_features}
                  </p>
                </div>
              </section>
            )}

            {project.challenges && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Challenges</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.challenges}
                  </p>
                </div>
              </section>
            )}

            {project.solutions && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Solutions</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.solutions}
                  </p>
                </div>
              </section>
            )}

            {project.results && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Results</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.results}
                  </p>
                </div>
              </section>
            )}

            {project.lessons_learned && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-4">Lessons Learned</h2>
                <div className="prose prose-neutral dark:prose-invert max-w-none">
                  <p className="whitespace-pre-wrap text-muted-foreground leading-relaxed">
                    {project.lessons_learned}
                  </p>
                </div>
              </section>
            )}

            {images && images.length > 0 && (
              <section className="mb-12">
                <h2 className="text-2xl font-semibold mb-6">Gallery</h2>
                <div className="grid gap-4">
                  {images.map((img) => (
                    <div
                      key={img.id}
                      className="rounded-lg overflow-hidden bg-muted"
                    >
                      <img
                        src={img.image_url}
                        alt={img.caption || project.name}
                        className="w-full object-cover"
                      />
                      {img.caption && (
                        <p className="text-sm text-muted-foreground p-3 text-center">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="flex flex-wrap gap-3 mb-16">
              {project.live_url && (
                <Button asChild size="lg">
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
              {project.github_url && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                </Button>
              )}
              {project.documentation_url && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={project.documentation_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                </Button>
              )}
              {project.demo_url && (
                <Button asChild variant="outline" size="lg">
                  <a
                    href={project.demo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Demo
                  </a>
                </Button>
              )}
            </div>

            {relatedProjects && relatedProjects.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold mb-6">Related Projects</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {relatedProjects.map((rp) => (
                    <Link key={rp.id} href={`/projects/${rp.slug}`}>
                      <Card className="group hover:shadow-md transition-all duration-300 h-full">
                        {rp.main_image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={rp.main_image}
                              alt={rp.name}
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <h3 className="font-semibold group-hover:text-primary transition-colors mb-1">
                            {rp.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {rp.short_description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </ProjectDetailAnimations>
        </div>
      </article>
    </>
  );
}
