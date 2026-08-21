"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, BookOpen, ExternalLink, Github, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProjectsProps { projects: any[] }

export function ProjectsSection({ projects }: ProjectsProps) {
  return (
    <section id="projects" className="section-shell bg-muted/25">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Selected work</span>
          <h2 className="section-title">Projects</h2>
          <p className="section-description">A complete look at the products, experiments, and solutions I have built.</p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.article key={project.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.04 }} className="surface surface-hover group flex flex-col overflow-hidden">
              <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-primary/15 to-cyan-400/10">
                {project.main_image ? <img src={project.main_image} alt={project.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center text-5xl font-black text-primary/25">{project.name?.charAt(0)}</div>}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">{project.is_featured && <Badge className="gap-1 border-amber-300/30 bg-amber-400/15 text-amber-100"><Star className="h-3 w-3 fill-current" />Featured</Badge>}{project.status && <Badge variant="outline" className="border-white/25 bg-black/20 text-white capitalize backdrop-blur-sm">{project.status}</Badge>}</div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  {project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} source code`} className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><Github className="h-4 w-4" /></a>}
                  {project.live_url && <a href={project.live_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.name} live site`} className="flex h-9 w-9 items-center justify-center rounded-xl bg-background/90 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"><ExternalLink className="h-4 w-4" /></a>}
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-bold tracking-tight">{project.name}</h3>{project.category && <span className="shrink-0 text-xs capitalize text-primary">{project.category}</span>}</div>
                {project.short_description && <p className="mt-3 text-sm font-medium leading-6 text-foreground/80">{project.short_description}</p>}
                {project.description && project.description !== project.short_description && <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">{project.description}</p>}
                {project.technologies?.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{project.technologies.map((technology: string) => <Badge key={technology} variant="secondary" className="rounded-md text-xs">{technology}</Badge>)}</div>}
                <div className="mt-auto flex flex-wrap gap-3 border-t pt-5 mt-6">
                  <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-0 text-primary hover:bg-transparent hover:text-primary" asChild><Link href={`/projects/${project.slug}`}>View details <ArrowUpRight className="h-4 w-4" /></Link></Button>
                  {project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><ExternalLink className="h-3.5 w-3.5" />Demo</a>}
                  {project.documentation_url && <a href={project.documentation_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"><BookOpen className="h-3.5 w-3.5" />Docs</a>}
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {projects.length > 0 && <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center"><Button variant="outline" className="rounded-xl" asChild><Link href="/projects">View All Projects <ArrowUpRight className="ml-2 h-4 w-4" /></Link></Button></motion.div>}
      </div>
    </section>
  );
}
