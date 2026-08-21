"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Briefcase, Code2, FolderOpen, MapPin } from "lucide-react";

interface AboutProps {
  profile: any;
  stats: { skills: number; experience: number; certifications: number; projects: number };
}

function AnimatedCounter({ value, label, icon: Icon }: { value: number; label: string; icon: any }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 1300;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div ref={ref} className="group flex items-center gap-3 rounded-2xl border bg-card/70 p-4 transition-colors hover:border-primary/30">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105"><Icon className="h-5 w-5" /></span>
      <span><span className="block text-2xl font-bold tracking-tight">{count}+</span><span className="text-xs text-muted-foreground">{label}</span></span>
    </div>
  );
}

export function AboutSection({ profile, stats }: AboutProps) {
  return (
    <section id="about" className="section-shell">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">A little context</span>
          <h2 className="section-title">About Me</h2>
          <p className="section-description">A closer look at the experience, curiosity, and craft behind the work.</p>
        </motion.div>

        <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 to-cyan-400/10 blur-2xl" />
            <div className="surface relative overflow-hidden rounded-[2rem] p-3">
              <div className="aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary/15 to-primary/5">
                {profile?.profile_image ? <img src={profile.profile_image} alt={profile.full_name || "Profile portrait"} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-8xl font-black text-primary/25">{(profile?.full_name || "A").charAt(0)}</div>}
              </div>
            </div>
            <div className="surface absolute -bottom-5 -right-5 hidden max-w-[190px] items-center gap-3 p-4 sm:flex"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Code2 className="h-4 w-4" /></span><span className="text-xs font-semibold leading-5">Turning complex ideas into clear experiences.</span></div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}>
            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">The person behind the pixels</span>
            <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">{profile?.professional_title || "Full-Stack Developer"}</h3>
            <p className="mt-6 whitespace-pre-line text-base leading-8 text-muted-foreground">{profile?.about || "Passionate developer with experience in building modern web applications."}</p>
            {profile?.location && <div className="mt-6 inline-flex items-center gap-2 rounded-full border bg-muted/60 px-3 py-2 text-sm text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />Based in {profile.location}</div>}
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.25 }} className="mt-16 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatedCounter value={stats.experience} label="Experiences" icon={Briefcase} />
          <AnimatedCounter value={stats.projects} label="Projects" icon={FolderOpen} />
          <AnimatedCounter value={stats.certifications} label="Certifications" icon={Award} />
          <AnimatedCounter value={stats.skills} label="Technologies" icon={Code2} />
        </motion.div>
      </div>
    </section>
  );
}
