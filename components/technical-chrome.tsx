import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { staticProfile } from "@/lib/static-data";

const navLinks = [
  { href: "/#projects", label: "Selected work" },
  { href: "/#orasoft", label: "ORA Soft" },
  { href: "/#skills", label: "Capabilities" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function TechnicalHeader() {
  return (
    <header className="technical-header">
      <Link href="/" className="technical-brand" aria-label="Asem Al-Manari home">
        <span className="technical-brand-avatar"><img src={staticProfile.profile_image} alt="" aria-hidden="true" /></span>
        <span>Asem Al-Manari<span className="technical-brand-slash">/</span></span>
      </Link>
      <nav className="technical-nav" aria-label="Primary navigation">
        {navLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
      </nav>
      <div className="technical-header-actions">
        <a href={`mailto:${staticProfile.email}`} className="technical-availability">Available for work</a>
        <Link href="/cv" className="technical-cv-link">View CV <ArrowUpRight size={14} /></Link>
        <details className="technical-mobile-details">
          <summary className="technical-mobile-toggle" aria-label="Open navigation menu"><Menu className="technical-menu-open-icon" size={18} /><X className="technical-menu-close-icon" size={18} /></summary>
          <div className="technical-mobile-menu">
            <nav aria-label="Mobile navigation">
              {navLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}<ArrowUpRight size={15} /></Link>)}
              <Link href="/cv">View CV <ArrowUpRight size={15} /></Link>
            </nav>
          </div>
        </details>
      </div>
    </header>
  );
}

export function TechnicalFooter() {
  return (
    <footer className="technical-footer technical-frame">
      <span><b>AM</b> © {new Date().getFullYear()} Asem Al-Manari</span>
      <span>Software development · mobile products · ORA Soft</span>
      <a href="#top">Back to top <ArrowUpRight size={15} /></a>
    </footer>
  );
}
