"use client";

import { motion } from "framer-motion";
import { Briefcase, Calendar, ExternalLink, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExperienceProps { experiences: any[] }

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="section-shell">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Professional journey</span>
          <h2 className="section-title">Experience</h2>
          <p className="section-description">The roles, collaborations, and environments that have shaped the way I build.</p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-transparent md:left-1/2 md:-translate-x-1/2" />
          {experiences.map((experience, index) => (
            <motion.article key={experience.id} initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className={`relative mb-10 pl-10 md:pl-0 ${index % 2 === 0 ? "md:pr-[calc(50%+2.5rem)]" : "md:pl-[calc(50%+2.5rem)]"}`}>
              <span className="absolute left-3 top-7 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary ring-8 ring-background md:left-1/2" />
              <div className="surface surface-hover p-6 md:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div><h3 className="text-lg font-bold tracking-tight">{experience.job_title}</h3><div className="mt-1 flex items-center gap-2 text-sm"><span className="font-semibold text-primary">{experience.company}</span>{experience.company_website && <a href={experience.company_website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${experience.company}`} className="text-muted-foreground transition-colors hover:text-primary"><ExternalLink className="h-3.5 w-3.5" /></a>}</div></div>
                  {experience.is_current && <Badge className="shrink-0 border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Current</Badge>}
                </div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {experience.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{experience.location}</span>}
                  {(experience.start_date || experience.end_date || experience.is_current) && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{formatDate(experience.start_date)} — {experience.is_current ? "Present" : formatDate(experience.end_date)}</span>}
                  {experience.employment_type && <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5 text-primary" />{experience.employment_type}</span>}
                </div>
                {experience.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{experience.description}</p>}
                {experience.responsibilities && <div className="mt-5 border-t pt-5"><p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-foreground">Responsibilities</p><p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{experience.responsibilities}</p></div>}
                {experience.technologies?.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{experience.technologies.map((technology: string) => <Badge key={technology} variant="secondary" className="rounded-md text-xs">{technology}</Badge>)}</div>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
