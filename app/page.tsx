import { AboutSection } from "@/components/sections/about";
import { CertificationsSection } from "@/components/sections/certifications";
import { ContactSection } from "@/components/sections/contact";
import { EducationSection } from "@/components/sections/education";
import { ExperienceSection } from "@/components/sections/experience";
import { Footer } from "@/components/footer";
import { HeroSection } from "@/components/sections/hero";
import { Navigation } from "@/components/navigation";
import { OrasoftSection } from "@/components/sections/orasoft";
import { ProjectsSection } from "@/components/sections/projects";
import { ServicesSection } from "@/components/sections/services";
import { SkillsSection } from "@/components/sections/skills";
import { staticProfile, staticSkills, staticExperiences, staticEducation, staticProjects, staticServices, staticCertifications, staticSocialLinks } from "@/lib/static-data";

export default function HomePage() {
  const stats = {
    skills: staticSkills.length,
    experience: staticExperiences.length,
    education: staticEducation.length,
    certifications: staticCertifications.length,
    projects: staticProjects.length,
  };

  return (
    <div className="relative min-h-screen">
      <Navigation />
      <main>
        <HeroSection profile={staticProfile} socialLinks={staticSocialLinks} />
        <AboutSection profile={staticProfile} stats={stats} />
        <SkillsSection skills={staticSkills} />
        <ExperienceSection experiences={staticExperiences} />
        <EducationSection education={staticEducation} />
        <CertificationsSection certifications={staticCertifications} />
        <ProjectsSection projects={staticProjects} />
        <OrasoftSection />
        <ServicesSection services={staticServices} />
        <ContactSection profile={staticProfile} />
      </main>
      <Footer profile={staticProfile} socialLinks={staticSocialLinks} />
    </div>
  );
}
