"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Globe,
  Database,
  Palette,
  Shield,
  ArrowRight,
  Check,
} from "lucide-react";

interface ServicesProps {
  services: any[];
}

const iconMap: Record<string, any> = {
  code: Code2,
  mobile: Smartphone,
  globe: Globe,
  database: Database,
  palette: Palette,
  security: Shield,
};

export function ServicesSection({ services }: ServicesProps) {
  return (
    <section id="services" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Services</h2>
          <div className="h-1 w-12 bg-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code2;
            const features = service.features
              ? service.features.split("\n").filter((f: string) => f.trim())
              : [];

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group p-6 rounded-xl bg-background border hover:shadow-lg transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
                </div>

                <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {service.short_description || service.description}
                </p>

                {features.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {features.slice(0, 4).map((feature: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <Check className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                        {feature.trim()}
                      </li>
                    ))}
                  </ul>
                )}

                {service.starting_price && (
                  <div className="pt-4 border-t">
                    <span className="text-xs text-muted-foreground">Starting from </span>
                    <span className="font-semibold text-primary">{service.starting_price}</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
