import Image from "next/image";
import { ArrowUpRight, ExternalLink } from "lucide-react";

const companyImages = [
  { src: "/orasoft/website-importance-comparison.webp", alt: "ORA Soft digital presence comparison" },
  { src: "/orasoft/brand-message.webp", alt: "ORA Soft brand message and digital product visual" },
  { src: "/orasoft/services-promo.webp", alt: "ORA Soft web and mobile services visual" },
  { src: "/orasoft/phone-promo.webp", alt: "ORA Soft mobile product experience visual" },
  { src: "/orasoft/laptop-hero.webp", alt: "ORA Soft website shown on a laptop" },
  { src: "/orasoft/future-business.webp", alt: "ORA Soft digital business visual" },
] as const;

const processSteps = [
  "Explore the context",
  "Map the path",
  "Build with clarity",
  "Improve what matters",
] as const;

export function OrasoftSection() {
  return (
    <section id="orasoft" className="section-shell overflow-hidden bg-gradient-to-br from-primary/[0.06] via-background to-cyan-400/[0.05]">
      <div className="container mx-auto px-4">
        <div className="border-b border-border/70 pb-10">
          <div className="mb-5 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            <span className="h-px w-8 bg-primary/70" />
            Founder-led company
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h2 className="section-title max-w-3xl">ORA Soft</h2>
              <p className="mt-5 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
                A software company founded and built by Asem Al-Manari to turn ambitious ideas and daily operations into clear digital systems.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href="https://orasoft.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Visit ORA Soft <ExternalLink className="h-4 w-4" />
              </a>
              <a
                href="https://orasoft.vercel.app/work"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border/80 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
              >
                View company work <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-8 border-b border-border/70 py-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Asem Al-Manari · Founder</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">Building software with purpose.</h3>
          </div>
          <div className="text-sm leading-7 text-muted-foreground md:text-base">
            <p>
              ORA Soft helps ambitious businesses turn ideas, products, and daily operations into clear digital systems that can launch, grow, and improve.
            </p>
            <p className="mt-3 font-medium text-foreground">
              Product discovery · UX/UI · Web platforms · Mobile apps · Digital operations
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 border-b border-border/70 py-6 md:grid-cols-4">
          {processSteps.map((step, index) => (
            <div key={step} className="border-r border-border/70 px-3 first:pl-0 last:border-r-0 md:px-5">
              <span className="block text-xs font-semibold tracking-[0.18em] text-primary">0{index + 1}</span>
              <span className="mt-2 block text-xs leading-5 text-muted-foreground md:text-sm">{step}</span>
            </div>
          ))}
        </div>

        <div className="mt-10" aria-label="ORA Soft visual gallery">
          <div className="grid grid-cols-2 gap-3 md:gap-5">
            {companyImages.slice(0, 2).map((image) => (
              <a
                key={image.src}
                href={image.src}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-[16/9] overflow-hidden rounded-xl border border-border/70 bg-muted/40"
                aria-label={`Open full-size image: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </a>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2 md:mt-5 md:gap-4">
            {companyImages.slice(2).map((image) => (
              <a
                key={image.src}
                href={image.src}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border/70 bg-muted/40"
                aria-label={`Open full-size image: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 25vw, 25vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
