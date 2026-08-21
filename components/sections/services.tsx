"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Check, Code2, Database, Globe, Palette, Shield, Smartphone } from "lucide-react";
import Link from "next/link";

interface ServicesProps { services: any[] }

const iconMap: Record<string, any> = { code: Code2, mobile: Smartphone, globe: Globe, database: Database, palette: Palette, security: Shield };

export function ServicesSection({ services }: ServicesProps) {
  return (
    <section id="services" className="section-shell">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">How I can help</span>
          <h2 className="section-title">Services</h2>
          <p className="section-description">Focused support for teams and founders who care about useful, reliable, and polished digital products.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;
            const features = service.features ? service.features.split("\n").filter((feature: string) => feature.trim()) : [];
            return (
              <motion.article key={service.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: index * 0.05 }} className="surface surface-hover group flex flex-col p-6">
                <div className="mb-6 flex items-start justify-between"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground"><Icon className="h-6 w-6" /></div><span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">0{index + 1}</span></div>
                <h3 className="text-xl font-bold tracking-tight">{service.title}</h3>
                {service.short_description && <p className="mt-3 text-sm font-medium leading-6 text-foreground/80">{service.short_description}</p>}
                {service.description && service.description !== service.short_description && <p className="mt-2 whitespace-pre-line text-sm leading-7 text-muted-foreground">{service.description}</p>}
                {features.length > 0 && <ul className="mt-5 space-y-3">{features.map((feature: string, featureIndex: number) => <li key={`${feature}-${featureIndex}`} className="flex items-start gap-2 text-sm leading-6 text-muted-foreground"><Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />{feature.trim()}</li>)}</ul>}
                <div className="mt-auto flex items-center justify-between gap-4 border-t pt-5 mt-7">{service.starting_price ? <span><span className="block text-[11px] uppercase tracking-wide text-muted-foreground">Starting from</span><span className="font-bold text-primary">{service.starting_price}</span></span> : <span />}{service.cta_link && <Link href={service.cta_link} className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-transform hover:translate-x-0.5">{service.cta_text || "Get in Touch"}<ArrowUpRight className="h-4 w-4" /></Link>}</div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
