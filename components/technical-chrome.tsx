"use client";

import Link from "next/link";
import { ArrowUpRight, Mail, Menu, X } from "lucide-react";
import { useState } from "react";
import { staticProfile } from "@/lib/static-data";

const navLinks = [
  { href: "/#projects", label: "Selected work" },
  { href: "/#orasoft", label: "ORA Soft" },
  { href: "/#skills", label: "Capabilities" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function TechnicalHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="technical-header">
        <Link href="/" className="technical-brand" aria-label="Asem Al-Manari home" onClick={closeMenu}>
          <span className="technical-brand-avatar"><img src={staticProfile.profile_image} alt="" aria-hidden="true" /></span>
          <span>Asem Al-Manari<span className="technical-brand-slash">/</span></span>
        </Link>
        <nav className="technical-nav" aria-label="Primary navigation">
          {navLinks.map((link) => <Link key={link.href} href={link.href}>{link.label}</Link>)}
        </nav>
        <div className="technical-header-actions">
          <a href={`mailto:${staticProfile.email}`} className="technical-availability">Available for work</a>
          <Link href="/cv" className="technical-cv-link">View CV <ArrowUpRight size={14} /></Link>
          <button type="button" className="technical-mobile-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>
      <div className={`technical-mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen} inert={!menuOpen ? true : undefined}>
        <nav aria-label="Mobile navigation">
          {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={closeMenu}>{link.label}<ArrowUpRight size={15} /></Link>)}
          <Link href="/cv" onClick={closeMenu}>View CV <ArrowUpRight size={15} /></Link>
        </nav>
      </div>
    </>
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
