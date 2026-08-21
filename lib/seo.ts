import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asem-portfolio-nine.vercel.app";
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Asem Portfolio";

export function generatePageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const ogImage = image || `${siteUrl}/og-default.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export function generatePersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Asem Al-Manari",
    jobTitle: "Full-Stack Developer",
    url: siteUrl,
    email: "hello@asem.dev",
    sameAs: [] as string[],
  };
}

export function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/projects?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProjectSchema({
  name,
  description,
  slug,
  image,
  technologies,
  startDate,
  endDate,
  githubUrl,
  liveUrl,
}: {
  name: string;
  description: string;
  slug: string;
  image?: string;
  technologies?: string[];
  startDate?: string | null;
  endDate?: string | null;
  githubUrl?: string;
  liveUrl?: string;
}) {
  const url = `${siteUrl}/projects/${slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description,
    url,
    image: image || `${siteUrl}/og-default.png`,
    author: {
      "@type": "Person",
      name: "Asem Al-Manari",
    },
    dateCreated: startDate || undefined,
    dateModified: endDate || undefined,
    keywords: technologies?.join(", ") || undefined,
    codeRepository: githubUrl || undefined,
    sameAs: liveUrl || undefined,
  };
}
