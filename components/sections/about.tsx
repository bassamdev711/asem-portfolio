"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase, FolderOpen, Award, Code2 } from "lucide-react";

interface AboutProps {
  profile: any;
  stats: {
    skills: number;
    experience: number;
    certifications: number;
    projects: number;
  };
}

function AnimatedCounter({ value, label, icon: Icon }: { value: number; label: string; icon: any }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <div ref={ref} className="text-center space-y-2">
      <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary mb-2">
        <Icon className="h-6 w-6" />
      </div>
      <div className="text-3xl font-bold">{count}+</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

export function AboutSection({ profile, stats }: AboutProps) {
  return (
    <section id="about" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
              {profile?.profile_image ? (
                <img
                  src={profile.profile_image}
                  alt={profile.full_name}
                  className="w-full aspect-square object-cover"
                />
              ) : (
                <div className="w-full aspect-square bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-8xl font-bold text-primary/30">
                  {(profile?.full_name || "A").charAt(0)}
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-2xl bg-primary/10 -z-10" />
            <div className="absolute -top-6 -left-6 h-32 w-32 rounded-2xl bg-primary/10 -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold">
              {profile?.professional_title || "Full-Stack Developer"}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {profile?.about || "Passionate developer with experience in building modern web applications."}
            </p>
            {profile?.location && (
              <p className="text-sm text-muted-foreground">
                Based in {profile.location}
              </p>
            )}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          <AnimatedCounter value={stats.experience} label="Experiences" icon={Briefcase} />
          <AnimatedCounter value={stats.projects} label="Projects" icon={FolderOpen} />
          <AnimatedCounter value={stats.certifications} label="Certifications" icon={Award} />
          <AnimatedCounter value={stats.skills} label="Technologies" icon={Code2} />
        </motion.div>
      </div>
    </section>
  );
}
