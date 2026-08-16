"use client";

import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    color: "#555",
    marginBottom: 8,
    textAlign: "center",
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 4,
    fontSize: 9,
    color: "#444",
  },
  contactItem: {
    marginRight: 12,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 4,
  },
  summary: {
    fontSize: 10,
    color: "#333",
    marginBottom: 12,
    lineHeight: 1.6,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCategoryTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  skillList: {
    fontSize: 9,
    color: "#444",
  },
  experienceItem: {
    marginBottom: 12,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  dateRange: {
    fontSize: 9,
    color: "#666",
  },
  company: {
    fontSize: 10,
    color: "#555",
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: "#333",
    lineHeight: 1.5,
  },
  technologies: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    gap: 4,
  },
  techBadge: {
    fontSize: 8,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 2,
  },
  certItem: {
    marginBottom: 8,
  },
  certName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  certOrg: {
    fontSize: 9,
    color: "#555",
  },
  certDate: {
    fontSize: 8,
    color: "#666",
  },
  certLink: {
    fontSize: 8,
    color: "#0066cc",
    textDecoration: "underline",
  },
  projectItem: {
    marginBottom: 8,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  projectName: {
    fontSize: 10,
    fontWeight: "bold",
  },
  projectCategory: {
    fontSize: 8,
    color: "#666",
  },
  projectDesc: {
    fontSize: 9,
    color: "#333",
    marginTop: 2,
  },
  linkRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 2,
  },
  link: {
    fontSize: 8,
    color: "#0066cc",
    textDecoration: "underline",
  },
});

interface CVData {
  profile: any;
  skills: any[];
  experiences: any[];
  education: any[];
  certifications: any[];
  featuredProjects: any[];
  socialLinks: any[];
}

export function CVPDFDocument({
  profile,
  skills,
  experiences,
  education,
  certifications,
  featuredProjects,
  socialLinks,
}: CVData) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Present";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const groupedSkills = skills.reduce(
    (acc: Record<string, any[]>, skill: any) => {
      const cat = skill.category || "Other";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skill);
      return acc;
    },
    {} as Record<string, any[]>
  );

  const githubLink = socialLinks?.find((l: any) => l.platform === "GitHub");
  const linkedinLink = socialLinks?.find((l: any) => l.platform === "LinkedIn");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile?.full_name || "Your Name"}</Text>
        <Text style={styles.title}>
          {profile?.professional_title || "Professional Title"}
        </Text>

        <View style={styles.contactRow}>
          {profile?.email && <Text style={styles.contactItem}>{profile.email}</Text>}
          {profile?.phone && <Text style={styles.contactItem}>{profile.phone}</Text>}
          {profile?.location && <Text style={styles.contactItem}>{profile.location}</Text>}
        </View>

        <View style={styles.contactRow}>
          {githubLink && (
            <Link src={githubLink.url} style={styles.contactItem}>
              GitHub
            </Link>
          )}
          {linkedinLink && (
            <Link src={linkedinLink.url} style={styles.contactItem}>
              LinkedIn
            </Link>
          )}
        </View>

        <View style={styles.divider} />

        {profile?.about && (
          <View>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summary}>{profile.about}</Text>
          </View>
        )}

        {Object.keys(groupedSkills).length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Skills</Text>
            {Object.entries(groupedSkills).map(([category, catSkills]: [string, any[]]) => (
              <View key={category} style={styles.skillCategory}>
                <Text style={styles.skillCategoryTitle}>{category}</Text>
                <Text style={styles.skillList}>
                  {catSkills.map((s: any) => s.name).join(" | ")}
                </Text>
              </View>
            ))}
          </View>
        )}

        {experiences.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Experience</Text>
            {experiences.map((exp: any) => (
              <View key={exp.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{exp.job_title}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(exp.start_date)} –{" "}
                    {exp.is_current ? "Present" : formatDate(exp.end_date)}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ""}
                  {exp.employment_type ? ` · ${exp.employment_type}` : ""}
                </Text>
                {exp.description && (
                  <Text style={styles.description}>{exp.description}</Text>
                )}
                {exp.responsibilities && (
                  <Text style={styles.description}>{exp.responsibilities}</Text>
                )}
                {exp.technologies?.length > 0 && (
                  <View style={styles.technologies}>
                    {exp.technologies.map((tech: string) => (
                      <Text key={tech} style={styles.techBadge}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu: any) => (
              <View key={edu.id} style={styles.experienceItem}>
                <View style={styles.experienceHeader}>
                  <Text style={styles.jobTitle}>{edu.degree}</Text>
                  <Text style={styles.dateRange}>
                    {formatDate(edu.start_date)} – {formatDate(edu.end_date)}
                  </Text>
                </View>
                <Text style={styles.company}>
                  {edu.institution}
                  {edu.location ? ` · ${edu.location}` : ""}
                </Text>
                {edu.gpa && (
                  <Text style={styles.description}>GPA: {edu.gpa}</Text>
                )}
                {edu.description && (
                  <Text style={styles.description}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {certifications.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certifications.map((cert: any) => (
              <View key={cert.id} style={styles.certItem}>
                <Text style={styles.certName}>{cert.name}</Text>
                <Text style={styles.certOrg}>{cert.issuing_organization}</Text>
                {cert.issue_date && (
                  <Text style={styles.certDate}>
                    Issued: {formatDate(cert.issue_date)}
                    {cert.expiration_date
                      ? ` · Expires: ${formatDate(cert.expiration_date)}`
                      : ""}
                  </Text>
                )}
                {cert.credential_url && (
                  <Link src={cert.credential_url} style={styles.certLink}>
                    View Credential
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {featuredProjects.length > 0 && (
          <View>
            <Text style={styles.sectionTitle}>Featured Projects</Text>
            {featuredProjects.map((proj: any) => (
              <View key={proj.id} style={styles.projectItem}>
                <View style={styles.projectHeader}>
                  <Text style={styles.projectName}>{proj.name}</Text>
                  <Text style={styles.projectCategory}>{proj.category}</Text>
                </View>
                {proj.short_description && (
                  <Text style={styles.projectDesc}>{proj.short_description}</Text>
                )}
                {proj.technologies?.length > 0 && (
                  <View style={styles.technologies}>
                    {proj.technologies.slice(0, 6).map((tech: string) => (
                      <Text key={tech} style={styles.techBadge}>
                        {tech}
                      </Text>
                    ))}
                  </View>
                )}
                <View style={styles.linkRow}>
                  {proj.github_url && (
                    <Link src={proj.github_url} style={styles.link}>
                      GitHub
                    </Link>
                  )}
                  {proj.live_url && (
                    <Link src={proj.live_url} style={styles.link}>
                      Live Demo
                    </Link>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
