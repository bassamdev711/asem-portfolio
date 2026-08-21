export type StaticProfile = {
  id: string;
  full_name: string;
  professional_title: string;
  headline: string;
  about: string;
  location: string;
  email: string;
  phone: string;
  profile_image: string;
  cv_file_url: string;
  resume_text: string;
};

export type StaticProjectImage = {
  id: string;
  image_url: string;
  caption: string;
  display_order: number;
};

export type StaticProject = {
  id: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  main_image: string;
  technologies: string[];
  category: string;
  start_date: string | null;
  end_date: string | null;
  duration: string;
  status: "Completed" | "In Progress" | "Archived";
  github_url: string;
  live_url: string;
  demo_url: string;
  documentation_url: string;
  other_urls: unknown[];
  challenges: string;
  solutions: string;
  key_features: string;
  my_role: string;
  results: string;
  lessons_learned: string;
  is_featured: boolean;
  display_order: number;
  is_published: boolean;
  meta_title: string;
  meta_description: string;
  gallery: StaticProjectImage[];
};

export const profile: StaticProfile = {
  id: "asem-profile",
  full_name: "Asem Alhakim",
  professional_title: "IT Support Specialist · Network Engineer · Mobile Developer",
  headline: "Building reliable systems and useful digital products.",
  about:
    "I am Asem Alhakim, an IT support specialist, network engineer, and mobile developer focused on making technology dependable and useful. I combine infrastructure thinking with product development to build clear digital experiences, practical tools, and systems that solve real problems.",
  location: "Available worldwide",
  email: "hello@asem.dev",
  phone: "",
  profile_image: "",
  cv_file_url: "",
  resume_text: "",
};

export const socialLinks = [
  { id: "github", platform: "GitHub", url: "https://github.com/bassamdev711", username: "bassamdev711" },
  { id: "email", platform: "Email", url: `mailto:${profile.email}`, username: profile.email },
];

export const skills = [
  { id: "react", name: "React", category: "Programming", description: "Modern React interfaces", icon: "Code", proficiency: 85, years_experience: 3 },
  { id: "nextjs", name: "Next.js", category: "Programming", description: "Full-stack React applications", icon: "Globe", proficiency: 80, years_experience: 2 },
  { id: "typescript", name: "TypeScript", category: "Programming", description: "Type-safe JavaScript development", icon: "FileCode", proficiency: 80, years_experience: 3 },
  { id: "flutter", name: "Flutter", category: "Mobile Development", description: "Cross-platform mobile applications", icon: "Smartphone", proficiency: 75, years_experience: 2 },
  { id: "node", name: "Node.js", category: "Programming", description: "Server-side JavaScript applications", icon: "Server", proficiency: 70, years_experience: 3 },
  { id: "postgresql", name: "PostgreSQL", category: "Databases", description: "Relational data modeling and queries", icon: "Database", proficiency: 70, years_experience: 3 },
  { id: "linux", name: "Linux", category: "IT Support", description: "System administration and troubleshooting", icon: "Terminal", proficiency: 80, years_experience: 4 },
  { id: "networking", name: "Networking", category: "Networking", description: "TCP/IP, DNS, DHCP, VPN, and diagnostics", icon: "Network", proficiency: 80, years_experience: 4 },
  { id: "git", name: "Git", category: "Tools", description: "Version control and collaborative workflows", icon: "GitBranch", proficiency: 85, years_experience: 4 },
  { id: "cybersecurity", name: "Cybersecurity", category: "Cybersecurity", description: "Security-minded infrastructure practices", icon: "Shield", proficiency: 60, years_experience: 2 },
];

export const experiences = [
  {
    id: "experience-it-support",
    job_title: "IT Support Specialist",
    company: "Technology Operations",
    location: "Remote",
    employment_type: "Full-time",
    start_date: "2022-01-01",
    end_date: null,
    is_current: true,
    description: "Providing technical support, troubleshooting, and infrastructure maintenance for dependable day-to-day operations.",
    responsibilities: "System support · Network troubleshooting · User assistance · Preventive maintenance",
    technologies: ["Windows Server", "Networking", "Linux", "Active Directory"],
    company_logo: "",
    company_website: "",
  },
  {
    id: "experience-mobile",
    job_title: "Freelance Mobile Developer",
    company: "Independent Projects",
    location: "Remote",
    employment_type: "Freelance",
    start_date: "2021-06-01",
    end_date: null,
    is_current: true,
    description: "Designing and developing cross-platform mobile applications with a focus on clear interfaces, maintainable code, and useful integrations.",
    responsibilities: "Mobile UI · API integration · Local persistence · Release preparation",
    technologies: ["Flutter", "Dart", "Firebase", "REST APIs"],
    company_logo: "",
    company_website: "",
  },
];

export const education = [
  {
    id: "education-it",
    degree: "Computer Science / Information Technology",
    institution: "Technology and Computing",
    location: "Remote",
    start_date: "2019-09-01",
    end_date: "2023-06-01",
    description: "Academic foundation in software development, information systems, and computing principles.",
    gpa: "",
    website: "",
  },
];

export const certifications = [
  {
    id: "cert-a-plus",
    name: "CompTIA A+",
    issuing_organization: "CompTIA",
    issue_date: "2023-01-01",
    expiration_date: null,
    credential_id: "",
    credential_url: "",
    certificate_image: "",
    description: "IT support fundamentals.",
    skills: ["Hardware", "Networking", "Operating Systems"],
  },
  {
    id: "cert-network-plus",
    name: "CompTIA Network+",
    issuing_organization: "CompTIA",
    issue_date: "2023-06-01",
    expiration_date: null,
    credential_id: "",
    credential_url: "",
    certificate_image: "",
    description: "Network infrastructure and management.",
    skills: ["Networking", "TCP/IP", "DNS"],
  },
];

export const projects: StaticProject[] = [
  {
    id: "project-portfolio",
    name: "Asem Portfolio",
    slug: "portfolio-website",
    short_description: "A clean static portfolio for software, infrastructure, and mobile work.",
    description: "A responsive portfolio experience that presents technical skills, selected work, experience, education, and a direct path to contact. It is intentionally static for fast, reliable deployment.",
    main_image: "/orasoft/laptop-hero.webp",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Vercel"],
    category: "Web Development",
    start_date: "2026-01-01",
    end_date: null,
    duration: "Ongoing",
    status: "In Progress",
    github_url: "https://github.com/bassamdev711/asem-portfolio",
    live_url: "https://asem-portfolio-nine.vercel.app",
    demo_url: "",
    documentation_url: "",
    other_urls: [],
    challenges: "Presenting a broad technical profile without making the experience feel crowded.",
    solutions: "A focused layout, reusable sections, clear project cards, and a separate founder-led company section.",
    key_features: "Responsive layout\nDark and light themes\nProject filtering\nStatic deployment\nSEO-friendly routes",
    my_role: "Designer and developer",
    results: "A fast and maintainable personal portfolio that can be deployed without a database.",
    lessons_learned: "A focused static architecture is often the right fit for a personal portfolio.",
    is_featured: true,
    display_order: 1,
    is_published: true,
    meta_title: "Asem Portfolio",
    meta_description: "Asem Alhakim's static software and technology portfolio.",
    gallery: [],
  },
  {
    id: "project-orasoft",
    name: "Aura Soft / Orasoft",
    slug: "aura-soft",
    short_description: "Founder-led software company building clear digital systems for ambitious businesses.",
    description: "Aura Soft is the software company founded and built by Asem Alhakim. It helps businesses turn ideas, products, and daily operations into digital systems that can launch, grow, and improve.",
    main_image: "/orasoft/laptop-hero.webp",
    technologies: ["Product Discovery", "UX/UI", "Web Platforms", "Mobile Apps", "Digital Operations"],
    category: "Full-Stack",
    start_date: null,
    end_date: null,
    duration: "Ongoing",
    status: "In Progress",
    github_url: "",
    live_url: "https://orasoft.vercel.app/",
    demo_url: "https://orasoft.vercel.app/work",
    documentation_url: "",
    other_urls: [],
    challenges: "Helping ambitious businesses make complex digital ideas easier to understand and operate.",
    solutions: "A product-minded approach that combines discovery, interface design, web platforms, mobile apps, and digital operations.",
    key_features: "Product discovery\nUX/UI design\nWeb platforms\nMobile applications\nDigital operations",
    my_role: "Founder",
    results: "A clear company identity and a growing body of practical digital products.",
    lessons_learned: "Good software begins by understanding the context before choosing the technology.",
    is_featured: true,
    display_order: 2,
    is_published: true,
    meta_title: "Aura Soft / Orasoft",
    meta_description: "Aura Soft, founded by Asem Alhakim, builds practical digital systems.",
    gallery: [
      { id: "orasoft-brand", image_url: "/orasoft/brand-message.webp", caption: "Brand message and digital product direction", display_order: 1 },
      { id: "orasoft-services", image_url: "/orasoft/services-promo.webp", caption: "Web and mobile services", display_order: 2 },
      { id: "orasoft-phone", image_url: "/orasoft/phone-promo.webp", caption: "Mobile product experience", display_order: 3 },
      { id: "orasoft-future", image_url: "/orasoft/future-business.webp", caption: "Digital business systems", display_order: 4 },
    ],
  },
  {
    id: "project-mobile-app",
    name: "Mobile App Template",
    slug: "mobile-app-template",
    short_description: "A reusable cross-platform foundation for modern mobile applications.",
    description: "A mobile application foundation organized around clean architecture, reusable UI patterns, and integrations that can be adapted to different product requirements.",
    main_image: "",
    technologies: ["Flutter", "Dart", "Firebase"],
    category: "Mobile App",
    start_date: "2021-06-01",
    end_date: null,
    duration: "Ongoing",
    status: "Completed",
    github_url: "",
    live_url: "",
    demo_url: "",
    documentation_url: "",
    other_urls: [],
    challenges: "Keeping the foundation flexible while preserving a clear development path.",
    solutions: "Reusable components, clear navigation, and a maintainable project structure.",
    key_features: "Cross-platform UI\nReusable architecture\nAPI-ready structure",
    my_role: "Mobile developer",
    results: "A practical starting point for new mobile product ideas.",
    lessons_learned: "Reusable foundations should simplify future decisions rather than hide them.",
    is_featured: false,
    display_order: 3,
    is_published: true,
    meta_title: "Mobile App Template",
    meta_description: "Asem's reusable Flutter mobile application foundation.",
    gallery: [],
  },
  {
    id: "project-network-monitoring",
    name: "Network Monitoring Dashboard",
    slug: "network-monitoring",
    short_description: "A monitoring concept for network performance, uptime, and security events.",
    description: "A focused dashboard concept for bringing network health, availability, and security signals into one clear operational view.",
    main_image: "",
    technologies: ["React", "Node.js", "PostgreSQL", "Docker"],
    category: "DevOps",
    start_date: "2022-01-01",
    end_date: null,
    duration: "Ongoing",
    status: "Completed",
    github_url: "",
    live_url: "",
    demo_url: "",
    documentation_url: "",
    other_urls: [],
    challenges: "Making technical signals understandable without overwhelming the operator.",
    solutions: "A structured dashboard with clear status hierarchy and room for future alerting integrations.",
    key_features: "Uptime monitoring\nPerformance overview\nSecurity event visibility",
    my_role: "Systems developer",
    results: "A clear information model for technical operations and troubleshooting.",
    lessons_learned: "Operational interfaces should prioritize decisions, not just data volume.",
    is_featured: false,
    display_order: 4,
    is_published: true,
    meta_title: "Network Monitoring Dashboard",
    meta_description: "Asem's network monitoring and operations dashboard concept.",
    gallery: [],
  },
];

export const services = [
  { id: "service-it", title: "IT Support", icon: "Headphones", short_description: "Professional technical support and troubleshooting", description: "Practical support for hardware, software, operating systems, and everyday technical issues.", features: "Remote support\nSystem maintenance\nUser assistance\nTroubleshooting" },
  { id: "service-network", title: "Network Engineering", icon: "Network", short_description: "Network design, configuration, and optimization", description: "Reliable network foundations designed for performance, security, and maintainability.", features: "Network design\nVPN setup\nFirewall configuration\nPerformance optimization" },
  { id: "service-mobile", title: "Mobile App Development", icon: "Smartphone", short_description: "Cross-platform applications with Flutter", description: "Mobile products built with a practical focus on useful experiences, maintainable code, and integration readiness.", features: "UI implementation\nAPI integration\nLocal persistence\nRelease preparation" },
  { id: "service-consulting", title: "Technical Consultation", icon: "MessageSquare", short_description: "Clear technology decisions for real requirements", description: "A second pair of eyes for product direction, infrastructure planning, security, and digital transformation.", features: "Technology assessment\nInfrastructure planning\nSecurity review\nDigital transformation" },
];

export const staticProfile = profile;
export const staticSocialLinks = socialLinks;
export const staticSkills = skills;
export const staticExperiences = experiences;
export const staticEducation = education;
export const staticCertifications = certifications;
export const staticProjects = projects;
export const staticServices = services;
