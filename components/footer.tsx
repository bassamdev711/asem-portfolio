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
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link
              href="/"
              className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
            >
              {profile?.full_name || "Asem"}
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {profile?.professional_title || "Full-Stack Developer"} passionate about building exceptional digital experiences.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Navigation</h4>
            <nav className="grid grid-cols-2 gap-2">
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
            <h4 className="font-semibold text-sm">Connect</h4>
            <div className="flex gap-3">
              {socialLinks?.map((link) => {
                const Icon = socialIcons[link.platform] || Github;
                return (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-9 w-9 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
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
