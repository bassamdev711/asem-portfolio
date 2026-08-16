import { createServerSupabaseClient } from "@/lib/supabase/server";
import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { EducationSection } from "@/components/sections/education";
import { CertificationsSection } from "@/components/sections/certifications";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { ContactSection } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Suspense } from "react";
import { PageSkeleton } from "@/components/page-skeleton";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [
    profileRes,
    skillsRes,
    experiencesRes,
    educationRes,
    projectsRes,
    servicesRes,
    certificationsRes,
    socialLinksRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*").single(),
    supabase.from("skills").select("*").eq("is_published", true).order("display_order"),
    supabase.from("experiences").select("*").eq("is_published", true).order("display_order"),
    supabase.from("education").select("*").eq("is_published", true).order("display_order"),
    supabase.from("projects").select("*").eq("is_published", true).order("display_order"),
    supabase.from("services").select("*").eq("is_published", true).order("display_order"),
    supabase.from("certifications").select("*").eq("is_published", true).order("display_order"),
    supabase.from("social_links").select("*").eq("is_published", true).order("display_order"),
  ]);

  const profile = profileRes.data;
  const skills = skillsRes.data ?? [];
  const experiences = experiencesRes.data ?? [];
  const education = educationRes.data ?? [];
  const projects = projectsRes.data ?? [];
  const services = servicesRes.data ?? [];
  const certifications = certificationsRes.data ?? [];
  const socialLinks = socialLinksRes.data ?? [];

  const stats = {
    skills: skills.length,
    experience: experiences.length,
    education: education.length,
    certifications: certifications.length,
    projects: projects.length,
  };

  return (
    <Suspense fallback={<PageSkeleton />}>
      <div className="relative min-h-screen">
        <Navigation />
        <main>
          <HeroSection profile={profile} socialLinks={socialLinks} />
          <AboutSection profile={profile} stats={stats} />
          <SkillsSection skills={skills} />
          <ExperienceSection experiences={experiences} />
          <EducationSection education={education} />
          <CertificationsSection certifications={certifications} />
          <ProjectsSection projects={projects} />
          <ServicesSection services={services} />
          <ContactSection />
        </main>
        <Footer profile={profile} socialLinks={socialLinks} />
      </div>
    </Suspense>
  );
}
