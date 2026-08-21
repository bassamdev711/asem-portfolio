"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Github, Linkedin, Twitter, Mail, Facebook, Instagram, Youtube, Globe, MessageCircle, Send, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface HeroProps {
  profile: any;
  socialLinks: any[];
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } },
};

const socialIcons: Record<string, any> = {
  GitHub: Github, github: Github, LinkedIn: Linkedin, linkedin: Linkedin,
  X: Twitter, Twitter: Twitter, twitter: Twitter, Email: Mail, email: Mail,
  Facebook: Facebook, facebook: Facebook, Instagram: Instagram, instagram: Instagram,
  YouTube: Youtube, youtube: Youtube, WhatsApp: MessageCircle, whatsapp: MessageCircle,
  Telegram: Send, telegram: Send, Website: Globe, website: Globe,
};

function FloatingOrb({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) {
  return (
    <motion.div
      className="absolute rounded-full bg-primary/8 blur-3xl"
      style={{ width: size, height: size, left: x, top: y }}
      animate={{ y: [0, -24, 0], x: [0, 12, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 7, repeat: Infinity, delay, ease: "easeInOut" }}
    />
  );
}

export function HeroSection({ profile, socialLinks }: HeroProps) {
  const [displayedText, setDisplayedText] = useState("");
  const fullText = profile?.professional_title || "Full-Stack Developer";

  useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayedText(fullText.slice(0, index));
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 68);
    return () => clearInterval(interval);
  }, [fullText]);

  return (
    <section id="home" className="relative isolate flex min-h-[700px] items-center overflow-hidden pb-14 pt-24 lg:min-h-[780px] lg:pt-28">
      <div className="grid-fade pointer-events-none absolute inset-0 -z-20" />
      <FloatingOrb delay={0} size={420} x="3%" y="10%" />
      <FloatingOrb delay={2} size={300} x="75%" y="52%" />
      <FloatingOrb delay={4} size={230} x="82%" y="4%" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.055),transparent_58%)]" />

      <div className="container relative z-10 mx-auto px-4">
        <motion.div variants={container} initial="hidden" animate="show" className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Available for meaningful digital products
            </motion.div>

            <motion.p variants={item} className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Hello, I&apos;m
            </motion.p>
            <motion.h1 variants={item} className="text-balance text-5xl font-black tracking-[-0.055em] md:text-7xl lg:text-8xl">
              {profile?.full_name || "Asem"}<span className="text-primary">.</span>
            </motion.h1>
            <motion.div variants={item} className="mt-5 flex items-center justify-center gap-2 text-xl font-medium text-muted-foreground md:text-2xl lg:justify-start">
              <span>{displayedText}</span>
              <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.7, repeat: Infinity }} className="inline-block h-7 w-0.5 bg-primary" />
            </motion.div>
            <motion.p variants={item} className="mx-auto mt-6 max-w-2xl text-balance text-base leading-8 text-muted-foreground md:text-lg lg:mx-0">
              {profile?.about || "Building exceptional digital experiences with modern technologies."}
            </motion.p>

            <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Button size="lg" className="group rounded-xl px-6 shadow-xl shadow-primary/20" asChild>
                <Link href="#projects">View Projects <ArrowUpRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl px-6" asChild>
                <a href={profile?.cv_file_url || "#"} download>Download CV</a>
              </Button>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              {socialLinks?.map((link) => {
                const Icon = socialIcons[link.platform] || Github;
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.platform} className="flex h-10 w-10 items-center justify-center rounded-xl border bg-background/60 text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
              {profile?.location && <span className="ml-1 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex"><MapPin className="h-3.5 w-3.5 text-primary" />{profile.location}</span>}
            </motion.div>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.88, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.9, delay: 0.3 }} className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-transparent to-cyan-400/15 blur-2xl" />
            <div className="surface soft-glow relative overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-primary/15 via-background to-cyan-400/10">
                {profile?.profile_image ? (
                  <img src={profile.profile_image} alt={profile.full_name || "Profile portrait"} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5 text-8xl font-black text-primary/40">{(profile?.full_name || "A").charAt(0)}</div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-6 pt-24 text-white">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">Crafting with intention</p>
                  <p className="mt-2 text-lg font-semibold">Designing systems people enjoy using.</p>
                </div>
              </div>
            </div>
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="surface absolute -bottom-5 -left-5 hidden items-center gap-3 px-4 py-3 sm:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
              <span><span className="block text-xs text-muted-foreground">Status</span><span className="text-sm font-semibold">Open to opportunities</span></span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground">
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="flex flex-col items-center gap-2"><span className="text-[10px] font-semibold uppercase tracking-[0.24em]">Scroll to explore</span><ArrowDown className="h-4 w-4" /></motion.div>
      </motion.div>
    </section>
  );
}
