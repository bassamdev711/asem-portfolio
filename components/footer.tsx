"use client";

import Link from "next/link";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  Heart,
  Facebook,
  Instagram,
  Youtube,
  Globe,
  MessageCircle,
  Send,
} from "lucide-react";

interface FooterProps {
  profile: any;
  socialLinks: any[];
}

const socialIcons: Record<string, any> = {
  GitHub: Github,
  github: Github,
  LinkedIn: Linkedin,
  linkedin: Linkedin,
  X: Twitter,
  Twitter: Twitter,
  twitter: Twitter,
  Email: Mail,
  email: Mail,
  Facebook: Facebook,
  facebook: Facebook,
  Instagram: Instagram,
  instagram: Instagram,
  YouTube: Youtube,
  youtube: Youtube,
  WhatsApp: MessageCircle,
  whatsapp: MessageCircle,
  Telegram: Send,
  telegram: Send,
  Website: Globe,
  website: Globe,
};

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#certifications", label: "Certifications" },
  { href: "#projects", label: "Projects" },
  { href: "#services", label: "Services" },
  { href: "#contact", label: "Contact" },
];

export function Footer({ profile, socialLinks }: FooterProps) {
  const scrollToSection = (href: string) => {
    const id = href.replace("#", "");
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="border-t bg-card/50">
      <div className="container mx-auto px-4 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
          <div className="space-y-4">
            <Link href="/" className="group inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground">A</span>
              <span className="text-lg font-bold">{profile?.full_name || "Asem"}<span className="text-primary">.</span></span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-7 text-muted-foreground">
              {profile?.professional_title || "Full-Stack Developer"} passionate about building exceptional digital experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">Navigation</h4>
            <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.16em]">Connect</h4>
            <p className="mt-5 max-w-xs text-sm leading-6 text-muted-foreground">Find me online or send a message through the contact section.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {socialLinks?.map((link) => {
                const Icon = socialIcons[link.platform] || Github;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-9 w-9 items-center justify-center rounded-xl border bg-background text-muted-foreground transition-all hover:-translate-y-1 hover:border-primary/35 hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {profile?.full_name || "Asem"}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> using Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
