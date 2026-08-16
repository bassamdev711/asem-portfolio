"use client";

import { motion } from "framer-motion";
import { GraduationCap, MapPin, Calendar, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface EducationProps {
  education: any[];
}

export function EducationSection({ education }: EducationProps) {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Education</h2>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
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
                    <h3 className="text-lg font-semibold">{edu.degree}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{edu.institution}</span>
                      {edu.website && (
                        <a
                          href={edu.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
                  {edu.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {edu.location}
                    </span>
                  )}
                  {(edu.start_date || edu.end_date) && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {edu.start_date
                        ? new Date(edu.start_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                      {" — "}
                      {edu.end_date
                        ? new Date(edu.end_date).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })
                        : "Present"}
                    </span>
                  )}
                  {edu.gpa && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3 w-3" />
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>

                {edu.description && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {edu.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
