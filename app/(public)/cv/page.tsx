import { Metadata } from "next";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  FolderGit2,
} from "lucide-react";
import { generatePageMetadata } from "@/lib/seo";
import { CVActions } from "@/components/cv/cv-actions";

export const metadata: Metadata = generatePageMetadata({
  title: "CV",
  description:
    "Download my professional CV or view my qualifications, experience, education, and certifications.",
  path: "/cv",
});

export default async function CVPage() {
  const supabase = await createServerSupabaseClient();

  const [profileRes, skillsRes, experiencesRes, certificationsRes, educationRes, projectsRes, socialLinksRes] =
    await Promise.all([
      supabase.from("profiles").select("*").single(),
      supabase.from("skills").select("*").eq("is_published", true).order("display_order"),
      supabase
        .from("experiences")
        .select("*")
        .eq("is_published", true)
        .order("display_order"),
      supabase
        .from("certifications")
        .select("*")
        .eq("is_published", true)
        .order("display_order"),
      supabase
        .from("education")
        .select("*")
        .eq("is_published", true)
        .order("display_order"),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("display_order"),
      supabase
        .from("social_links")
        .select("*")
        .eq("is_published", true)
        .order("display_order"),
    ]);

  const profile = profileRes.data;
  const skills = skillsRes.data ?? [];
  const experiences = experiencesRes.data ?? [];
  const certifications = certificationsRes.data ?? [];
  const education = educationRes.data ?? [];
  const featuredProjects = projectsRes.data ?? [];
  const socialLinks = socialLinksRes.data ?? [];

  const groupedSkills = skills.reduce(
    (acc: Record<string, typeof skills>, skill) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {}
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="py-20 print:py-0">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 print:hidden">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Curriculum <span className="gradient-text">Vitae</span>
            </h1>
            <p className="text-muted-foreground">
              Download as PDF or use Ctrl+P (Cmd+P) to print.
            </p>
          </div>
          <CVActions
            profile={profile}
            skills={skills}
            experiences={experiences}
            education={education}
            certifications={certifications}
            featuredProjects={featuredProjects}
            socialLinks={socialLinks}
          />
        </div>

        <div className="print:text-black print:bg-white space-y-10">
          <header className="text-center pb-8 border-b">
            {profile?.profile_image && (
              <img
                src={profile.profile_image}
                alt={profile.full_name}
                className="h-24 w-24 rounded-full mx-auto mb-4 object-cover print:h-16 print:w-16"
              />
            )}
            <h1 className="text-3xl font-bold mb-1">
              {profile?.full_name || "Your Name"}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {profile?.professional_title || "Professional Title"}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              {profile?.email && (
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {profile.email}
                </span>
              )}
              {profile?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5" />
                  {profile.phone}
                </span>
              )}
              {profile?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.location}
                </span>
              )}
            </div>
          </header>

          {profile?.about && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                Professional Summary
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {profile.about}
              </p>
            </section>
          )}

          {Object.keys(groupedSkills).length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4">Skills</h2>
              <div className="space-y-3">
                {Object.entries(groupedSkills).map(([category, catSkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-sm mb-2">{category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {catSkills.map((skill) => (
                        <Badge key={skill.id} variant="secondary" className="text-xs">
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Experience
              </h2>
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="font-semibold">{exp.job_title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(exp.start_date)} –{" "}
                        {exp.is_current ? "Present" : formatDate(exp.end_date)}
                      </p>
                    </div>
                    <p className="text-sm text-primary mb-2">
                      {exp.company}
                      {exp.location && ` · ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {exp.description}
                      </p>
                    )}
                    {exp.responsibilities && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {exp.responsibilities}
                      </p>
                    )}
                    {exp.technologies && exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(exp.technologies as string[]).map((tech: string) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
                      </p>
                    </div>
                    <p className="text-sm text-primary mb-1">
                      {edu.institution}
                      {edu.location && ` · ${edu.location}`}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <Award className="h-5 w-5" />
                Certifications
              </h2>
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <h3 className="font-semibold">{cert.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {cert.issue_date
                          ? formatDate(cert.issue_date)
                          : ""}
                      </p>
                    </div>
                    <p className="text-sm text-primary">{cert.issuing_organization}</p>
                    {cert.credential_url && (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1 mt-1"
                      >
                        View Credential <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {featuredProjects.length > 0 && (
            <section>
              <h2 className="text-xl font-bold border-b pb-2 mb-4 flex items-center gap-2">
                <FolderGit2 className="h-5 w-5" />
                Featured Projects
              </h2>
              <div className="space-y-4">
                {featuredProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{proj.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {proj.category}
                      </Badge>
                    </div>
                    {proj.short_description && (
                      <p className="text-sm text-muted-foreground">
                        {proj.short_description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(proj.technologies as string[]).slice(0, 8).map((tech: string) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </section>
  );
}
