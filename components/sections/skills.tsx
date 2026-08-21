"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SkillsProps { skills: any[] }

export function SkillsSection({ skills }: SkillsProps) {
  const categories = ["all", ...Array.from(new Set(skills.map((skill) => skill.category).filter(Boolean)))];
  const [activeCategory, setActiveCategory] = useState("all");
  const filtered = activeCategory === "all" ? skills : skills.filter((skill) => skill.category === activeCategory);

  return (
    <section id="skills" className="section-shell overflow-hidden bg-muted/25">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Tools of the trade</span>
          <h2 className="section-title">Skills &amp; Technologies</h2>
          <p className="section-description">A practical toolkit shaped by real projects, thoughtful decisions, and continuous learning.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="mb-10 flex justify-center overflow-x-auto pb-1">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="h-auto flex-nowrap gap-1 rounded-xl border bg-background/80 p-1">
              {categories.map((category) => <TabsTrigger key={category} value={category} className="rounded-lg px-4 capitalize">{category}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((skill, index) => (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.04 }} className="surface surface-hover group p-5">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">{skill.icon || skill.name?.charAt(0)}</div>
                <div className="min-w-0 flex-1"><h3 className="truncate font-semibold">{skill.name}</h3><p className="text-xs capitalize text-muted-foreground">{skill.category}</p></div>
                <span className="text-sm font-bold text-primary">{skill.proficiency}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted"><motion.div className="h-full rounded-full bg-gradient-to-r from-primary via-violet-400 to-cyan-400" initial={{ width: 0 }} whileInView={{ width: `${skill.proficiency}%` }} viewport={{ once: true }} transition={{ duration: 0.9, delay: index * 0.04, ease: "easeOut" }} /></div>
              {skill.description && <p className="mt-3 text-sm leading-6 text-muted-foreground">{skill.description}</p>}
              {typeof skill.years_experience === "number" && skill.years_experience > 0 && <p className="mt-3 text-xs font-medium text-muted-foreground">{skill.years_experience} {skill.years_experience === 1 ? "year" : "years"} of experience</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
