import Image from "next/image";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";

const companyImages = [
  {
    src: "/orasoft/website-importance-comparison.webp",
    alt: "Aura Soft digital presence comparison",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "/orasoft/brand-message.webp",
    alt: "Aura Soft brand message and digital product visual",
    className: "",
  },
  {
    src: "/orasoft/services-promo.webp",
    alt: "Aura Soft web and mobile services visual",
    className: "",
  },
  {
    src: "/orasoft/phone-promo.webp",
    alt: "Aura Soft mobile product experience",
    className: "",
  },
  {
    src: "/orasoft/laptop-hero.webp",
    alt: "Aura Soft website shown on a laptop",
    className: "",
  },
  {
    src: "/orasoft/future-business.webp",
    alt: "Aura Soft digital business visual",
    className: "md:col-span-2",
  },
] as const;

export function OrasoftSection() {
  return (
    <section id="orasoft" className="section-shell overflow-hidden bg-gradient-to-br from-primary/[0.07] via-background to-cyan-400/[0.06]">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex flex-col gap-4 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              <Sparkles className="h-4 w-4" />
              Founder-led company
            </div>
            <h2 className="section-title max-w-3xl">
              Aura Soft <span className="text-primary">/ Orasoft</span>
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground sm:text-right">
            A software company founded and built by Asem Alhakim to turn ambitious ideas and daily operations into clear digital systems.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-6">
            <div className="surface surface-hover p-6 sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Asem Alhakim · Founder</p>
              <h3 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">
                Building software with purpose.
              </h3>
              <div className="mt-5 space-y-4 text-sm leading-7 text-muted-foreground">
                <p>
                  Aura Soft is the software company founded and built by Asem Alhakim. It helps ambitious businesses turn ideas, products, and daily operations into clear digital systems that can launch, grow, and improve.
                </p>
                <p className="font-medium text-foreground">
                  Product discovery · UX/UI · Web platforms · Mobile apps · Digital operations
                </p>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="https://orasoft.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
                >
                  Visit Aura Soft <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://orasoft.vercel.app/work"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors hover:border-primary hover:text-primary"
                >
                  View company work <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-medium text-muted-foreground sm:grid-cols-4">
              {[
                "Explore the context",
                "Map the path",
                "Build with clarity",
                "Improve what matters",
              ].map((step, index) => (
                <div key={step} className="rounded-xl border bg-background/70 p-4 leading-5">
                  <span className="mb-2 block text-primary">0{index + 1}</span>
                  {step}
                </div>
              ))}
            </div>
          </div>

          <div className="grid auto-rows-[150px] grid-cols-2 gap-3 sm:auto-rows-[180px] sm:grid-cols-3">
            {companyImages.map((image) => (
              <a
                key={image.src}
                href={image.src}
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden rounded-2xl border bg-muted/40 ${image.className}`}
                aria-label={`Open full-size image: ${image.alt}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 30vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                <ArrowUpRight className="absolute right-3 top-3 h-4 w-4 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
