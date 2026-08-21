"use client";

import { motion } from "framer-motion";
import { Award, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CertificationsProps { certifications: any[] }

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "";
}

export function CertificationsSection({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="section-shell">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="section-heading">
          <span className="section-kicker">Proof of practice</span>
          <h2 className="section-title">Certifications</h2>
          <p className="section-description">Credentials and focused learning that reinforce the quality behind the work.</p>
        </motion.div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((certification, index) => (
            <motion.article key={certification.id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: index * 0.05 }} className="surface surface-hover group p-6">
              <div className="flex items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">{certification.certificate_image ? <img src={certification.certificate_image} alt={certification.name} className="h-8 w-8 object-contain" /> : <Award className="h-6 w-6 text-primary" />}</div><div className="min-w-0"><h3 className="font-bold leading-6">{certification.name}</h3><p className="mt-1 text-sm text-muted-foreground">{certification.issuing_organization}</p></div></div>
              {certification.description && <p className="mt-5 whitespace-pre-line text-sm leading-7 text-muted-foreground">{certification.description}</p>}
              {certification.skills?.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{certification.skills.map((skill: string) => <Badge key={skill} variant="secondary" className="rounded-md text-xs">{skill}</Badge>)}</div>}
              {(certification.issue_date || certification.expiration_date || certification.credential_id || certification.credential_url) && <div className="mt-5 space-y-3 border-t pt-4">
                {(certification.issue_date || certification.expiration_date) && <span className="flex items-center gap-2 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5 text-primary" />Issued {formatDate(certification.issue_date)}{certification.expiration_date ? ` · Expires ${formatDate(certification.expiration_date)}` : ""}</span>}
                {certification.credential_id && <p className="text-xs text-muted-foreground">Credential ID: <span className="font-medium text-foreground">{certification.credential_id}</span></p>}
                {certification.credential_url && <a href={certification.credential_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">Verify credential <ExternalLink className="h-3.5 w-3.5" /></a>}
              </div>}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
