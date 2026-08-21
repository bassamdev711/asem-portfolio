"use client";

import { motion } from "framer-motion";
import { Calendar, ExternalLink, GraduationCap, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationProps { education: any[] }

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
}

export function EducationSection({ education }: EducationProps) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="section-shell bg-muted/25">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Learning by design</span>
          <h2 className="section-title">Education</h2>
          <p className="section-description">The foundations and learning milestones that continue to inform my practice.</p>
        </motion.div>

        <div className="relative mx-auto max-w-4xl">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-border to-transparent md:left-1/2 md:-translate-x-1/2" />
          {education.map((item, index) => (
            <motion.article key={item.id} initial={{ opacity: 0, x: index % 2 === 0 ? -28 : 28 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className={cn("relative mb-10 pl-10 md:pl-0", index % 2 === 0 ? "md:pr-[calc(50%+2.5rem)]" : "md:pl-[calc(50%+2.5rem)]")}>
              <span className="absolute left-3 top-7 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary ring-8 ring-background md:left-1/2" />
              <div className="surface surface-hover p-6 md:p-7">
                <div className="flex items-start gap-4"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><GraduationCap className="h-5 w-5" /></span><div><h3 className="text-lg font-bold tracking-tight">{item.degree}</h3><div className="mt-1 flex items-center gap-2 text-sm"><span className="font-semibold text-primary">{item.institution}</span>{item.website && <a href={item.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${item.institution}`} className="text-muted-foreground transition-colors hover:text-primary"><ExternalLink className="h-3.5 w-3.5" /></a>}</div></div></div>
                <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                  {item.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-primary" />{item.location}</span>}
                  {(item.start_date || item.end_date) && <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-primary" />{formatDate(item.start_date)} — {formatDate(item.end_date) || "Present"}</span>}
                  {item.gpa && <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5 text-primary" />GPA: {item.gpa}</span>}
                </div>
                {item.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{item.description}</p>}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
