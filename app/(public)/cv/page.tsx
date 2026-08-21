import { Metadata } from "next";
import { staticCertifications, staticEducation, staticExperiences, staticProfile, staticProjects, staticSkills, staticSocialLinks } from "@/lib/static-data";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { CVActions } from "@/components/cv/cv-actions";

export const metadata: Metadata = generatePageMetadata({
  title: "CV",
  description: "Download or print Asem Al-Manari's professional CV, experience, education, certifications, skills, and selected projects.",
  path: "/cv",
});

export default function CVPage() {
  const profile = staticProfile;
  const groupedSkills = staticSkills.reduce<Record<string, typeof staticSkills>>((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {});
  const featuredProjects = staticProjects.filter((project) => project.is_featured);
  const formatDate = (date: string | null) => date ? new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present";

  return (
    <main className="technical-cv-page">
      <div className="technical-frame technical-cv-frame">
        <header className="technical-cv-toolbar print:hidden">
          <div><p className="technical-eyebrow"><span className="technical-eyebrow-line" /> Professional record</p><h1>Curriculum <span>Vitae</span></h1><p>Review the full record or export it for print and applications.</p></div>
          <CVActions profile={profile} skills={staticSkills} experiences={staticExperiences} education={staticEducation} certifications={staticCertifications} featuredProjects={featuredProjects} socialLinks={staticSocialLinks} />
        </header>

        <article className="technical-cv-sheet print:text-black print:bg-white">
          <header className="technical-cv-identity">
            <div className="technical-cv-portrait">{profile.profile_image && <img src={profile.profile_image} alt={profile.full_name} />}</div>
            <div className="technical-cv-name"><p className="technical-cv-kicker">AM / Technical portfolio</p><h2>{profile.full_name}</h2><p className="technical-cv-title">{profile.professional_title}</p><div className="technical-cv-contact">{profile.email && <span><Mail size={14} />{profile.email}</span>}{profile.phone && <span><Phone size={14} />{profile.phone}</span>}{profile.location && <span><MapPin size={14} />{profile.location}</span>}</div></div>
            <div className="technical-cv-index"><span>CV</span><strong>2026</strong><small>IT / SYSTEMS<br />MOBILE / WEB</small></div>
          </header>

          {profile.about && <CVSection number="01" label="Profile"><h3>Professional Summary</h3><p>{profile.about}</p></CVSection>}

          <CVSection number="02" label="Technical range"><h3>Skills</h3><div className="technical-cv-skill-grid">{Object.entries(groupedSkills).map(([category, skills]) => <div key={category}><span className="technical-cv-label">{category}</span><strong>{skills.map((skill) => skill.name).join(" · ")}</strong><small>{skills.map((skill) => skill.description).join(" · ")}</small></div>)}</div></CVSection>

          <CVSection number="03" label="Professional history"><h3>Experience</h3><div className="technical-cv-timeline">{staticExperiences.map((experience) => <article key={experience.id}><div className="technical-cv-date">{formatDate(experience.start_date)} — {experience.is_current ? "Present" : formatDate(experience.end_date)}</div><div><h4>{experience.job_title}</h4><p className="technical-cv-company">{experience.company} · {experience.location}</p>{experience.description && <p>{experience.description}</p>}{experience.responsibilities && <p className="technical-cv-responsibility">{experience.responsibilities}</p>}<div className="technical-cv-tags">{experience.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></article>)}</div></CVSection>

          <div className="technical-cv-two-section"><CVSection number="04" label="Foundations"><h3>Education</h3>{staticEducation.map((education) => <article className="technical-cv-compact-item" key={education.id}><span>{formatDate(education.start_date)} — {formatDate(education.end_date)}</span><h4>{education.degree}</h4><p>{education.institution} · {education.location}</p><small>{education.description}</small></article>)}</CVSection><CVSection number="05" label="Credentials"><h3>Certifications</h3>{staticCertifications.map((certification) => <article className="technical-cv-compact-item" key={certification.id}><span>{formatDate(certification.issue_date)}</span><h4>{certification.name}</h4><p>{certification.issuing_organization}</p><small>{certification.description}</small>{certification.credential_url && <a href={certification.credential_url} target="_blank" rel="noreferrer">View credential <ExternalLink size={13} /></a>}</article>)}</CVSection></div>

          <CVSection number="06" label="Selected proof"><h3>Featured Projects</h3><div className="technical-cv-projects">{featuredProjects.map((project) => <article key={project.id}><div><span className="technical-cv-label">{project.category} · {project.slug}</span><h4>{project.name}</h4></div><div><p>{project.short_description}</p><div className="technical-cv-tags">{project.technologies.slice(0, 8).map((technology) => <span key={technology}>{technology}</span>)}</div></div></article>)}</div></CVSection>

          <footer className="technical-cv-footer"><span>Asem Al-Manari · {profile.email}</span><span>Technical portfolio / 2026</span></footer>
        </article>
      </div>
    </main>
  );
}

function CVSection({ number, label, children }: { number: string; label: string; children: React.ReactNode }) {
  return <section className="technical-cv-section"><div className="technical-cv-section-label"><span>{number}</span>{label}</div><div className="technical-cv-section-content">{children}</div></section>;
}
