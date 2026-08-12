"use client";

import { motion } from "framer-motion";
import { Briefcase, MapPin, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ExperienceProps {
  experiences: any[];
}

export function ExperienceSection({ experiences }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Experience</h2>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={cn(
                "relative mb-8 pl-12 md:pl-0",
                index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
              )}
            >
              <div className="absolute left-4 md:left-1/2 top-6 h-3 w-3 rounded-full bg-primary border-4 border-background -translate-x-1/2 z-10" />

              <div className="p-6 rounded-xl bg-background border hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-lg font-semibold">{exp.job_title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{exp.company}</span>
                      {exp.company_website && (
                        <a
                          href={exp.company_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                  {exp.is_current && (
                    <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shrink-0">
                      Current
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {exp.location}
                    </span>
                  )}
                  {(exp.start_date || exp.end_date) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {exp.start_date ? new Date(exp.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                      {" — "}
                      {exp.is_current ? "Present" : exp.end_date ? new Date(exp.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""}
                    </span>
                  )}
                  {exp.employment_type && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {exp.employment_type}
                    </span>
                  )}
                </div>

                {exp.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {exp.description}
                  </p>
                )}

                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {exp.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
