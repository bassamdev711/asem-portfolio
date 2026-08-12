-- =============================================
-- PORTFOLIO DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT DEFAULT '',
  professional_title TEXT DEFAULT '',
  headline TEXT DEFAULT '',
  about TEXT DEFAULT '',
  location TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  profile_image TEXT DEFAULT '',
  cv_file_url TEXT DEFAULT '',
  resume_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT DEFAULT '',
  type TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SKILLS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS skills (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'Other',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT '',
  proficiency INTEGER DEFAULT 50 CHECK (proficiency >= 0 AND proficiency <= 100),
  years_experience INTEGER DEFAULT 0,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EXPERIENCE TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS experiences (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT '',
  employment_type TEXT DEFAULT 'Full-time',
  start_date DATE,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  responsibilities TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  company_logo TEXT DEFAULT '',
  company_website TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CERTIFICATIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS certifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  issuing_organization TEXT NOT NULL,
  issue_date DATE,
  expiration_date DATE,
  credential_id TEXT DEFAULT '',
  credential_url TEXT DEFAULT '',
  certificate_image TEXT DEFAULT '',
  description TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  main_image TEXT DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  category TEXT DEFAULT 'Other',
  start_date DATE,
  end_date DATE,
  duration TEXT DEFAULT '',
  status TEXT DEFAULT 'Completed' CHECK (status IN ('Completed', 'In Progress', 'Archived')),
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  demo_url TEXT DEFAULT '',
  documentation_url TEXT DEFAULT '',
  other_urls JSONB DEFAULT '[]',
  challenges TEXT DEFAULT '',
  solutions TEXT DEFAULT '',
  key_features TEXT DEFAULT '',
  my_role TEXT DEFAULT '',
  results TEXT DEFAULT '',
  lessons_learned TEXT DEFAULT '',
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROJECT IMAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS project_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SERVICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  icon TEXT DEFAULT '',
  short_description TEXT DEFAULT '',
  description TEXT DEFAULT '',
  features TEXT DEFAULT '',
  starting_price TEXT DEFAULT '',
  cta_text TEXT DEFAULT 'Get in Touch',
  cta_link TEXT DEFAULT '/contact',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- EDUCATION TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS education (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  location TEXT DEFAULT '',
  start_date DATE,
  end_date DATE,
  description TEXT DEFAULT '',
  gpa TEXT DEFAULT '',
  website TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SOCIAL LINKS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  platform TEXT NOT NULL,
  url TEXT NOT NULL,
  username TEXT DEFAULT '',
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- CONTACT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT DEFAULT '',
  message TEXT NOT NULL,
  phone TEXT DEFAULT '',
  company TEXT DEFAULT '',
  service_interest TEXT DEFAULT '',
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- SEO SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  page_slug TEXT UNIQUE NOT NULL,
  meta_title TEXT DEFAULT '',
  meta_description TEXT DEFAULT '',
  og_image TEXT DEFAULT '',
  keywords TEXT DEFAULT '',
  canonical_url TEXT DEFAULT '',
  is_indexable BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_skills_category ON skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_published ON skills(is_published);
CREATE INDEX IF NOT EXISTS idx_experiences_published ON experiences(is_published);
CREATE INDEX IF NOT EXISTS idx_certifications_published ON certifications(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured);
CREATE INDEX IF NOT EXISTS idx_services_published ON services(is_published);
CREATE INDEX IF NOT EXISTS idx_education_published ON education(is_published);
CREATE INDEX IF NOT EXISTS idx_social_links_published ON social_links(is_published);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_seo_settings_slug ON seo_settings(page_slug);

-- =============================================
-- SEED DATA: Site Settings
-- =============================================
INSERT INTO site_settings (key, value, type) VALUES
  ('site_name', 'Asem Portfolio', 'text'),
  ('site_description', 'IT Support Specialist | Network Engineer | Mobile Developer', 'text'),
  ('footer_text', 'Building innovative solutions with technology', 'text'),
  ('copyright', '© 2024 Asem. All rights reserved.', 'text'),
  ('primary_email', 'contact@example.com', 'email'),
  ('contact_email', 'contact@example.com', 'email'),
  ('theme', 'system', 'text')
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- SEED DATA: Skills
-- =============================================
INSERT INTO skills (name, category, description, icon, proficiency, years_experience, display_order) VALUES
  ('React', 'Programming', 'Modern React with hooks and context', 'Code', 85, 3, 1),
  ('Next.js', 'Programming', 'Full-stack React framework', 'Globe', 80, 2, 2),
  ('TypeScript', 'Programming', 'Type-safe JavaScript development', 'FileCode', 80, 3, 3),
  ('Flutter', 'Mobile Development', 'Cross-platform mobile app development', 'Smartphone', 75, 2, 4),
  ('Node.js', 'Programming', 'Server-side JavaScript runtime', 'Server', 70, 3, 5),
  ('PostgreSQL', 'Databases', 'Advanced relational database', 'Database', 70, 3, 6),
  ('Docker', 'Cloud', 'Containerization platform', 'Container', 65, 2, 7),
  ('AWS', 'Cloud', 'Amazon Web Services cloud platform', 'Cloud', 60, 2, 8),
  ('Linux', 'IT Support', 'Linux system administration', 'Terminal', 80, 4, 9),
  ('Windows Server', 'IT Support', 'Windows Server administration', 'Monitor', 75, 4, 10),
  ('Networking', 'Networking', 'TCP/IP, DNS, DHCP, VPN', 'Network', 80, 4, 11),
  ('Git', 'Tools', 'Version control system', 'GitBranch', 85, 4, 12),
  ('Figma', 'Tools', 'UI/UX design tool', 'Palette', 60, 2, 13),
  ('Python', 'Programming', 'General-purpose programming', 'Code', 65, 2, 14),
  ('Cybersecurity', 'Cybersecurity', 'Security best practices and protocols', 'Shield', 60, 2, 15)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Experience
-- =============================================
INSERT INTO experiences (job_title, company, location, employment_type, start_date, is_current, description, technologies, display_order) VALUES
  ('IT Support Specialist', 'Tech Company', 'Remote', 'Full-time', '2022-01-01', true, 'Providing technical support and maintaining IT infrastructure for enterprise clients.', ARRAY['Windows Server', 'Active Directory', 'Networking', 'Linux'], 1),
  ('Freelance Mobile Developer', 'Self-Employed', 'Remote', 'Freelance', '2021-06-01', true, 'Developing cross-platform mobile applications using Flutter and Dart.', ARRAY['Flutter', 'Dart', 'Firebase', 'REST APIs'], 2)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Certifications
-- =============================================
INSERT INTO certifications (name, issuing_organization, issue_date, credential_id, description, skills, display_order) VALUES
  ('CompTIA A+', 'CompTIA', '2023-01-01', 'PLACEHOLDER-A+', 'IT support fundamentals', ARRAY['Hardware', 'Networking', 'Operating Systems'], 1),
  ('CompTIA Network+', 'CompTIA', '2023-06-01', 'PLACEHOLDER-NET+', 'Network infrastructure and management', ARRAY['Networking', 'TCP/IP', 'DNS'], 2)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Projects
-- =============================================
INSERT INTO projects (name, slug, short_description, description, technologies, category, status, is_featured, display_order) VALUES
  ('Portfolio Website', 'portfolio-website', 'Modern portfolio website built with Next.js', 'A responsive and dynamic portfolio website featuring admin CMS, dark mode, and smooth animations.', ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Supabase'], 'Web Development', 'In Progress', true, 1),
  ('Mobile App Template', 'mobile-app-template', 'Cross-platform mobile application template', 'A reusable Flutter template for building modern mobile applications with clean architecture.', ARRAY['Flutter', 'Dart', 'Firebase'], 'Mobile Development', 'Completed', true, 2),
  ('Network Monitoring Dashboard', 'network-monitoring', 'Real-time network monitoring tool', 'Dashboard for monitoring network performance, uptime, and security events.', ARRAY['React', 'Node.js', 'PostgreSQL', 'Docker'], 'IT Support', 'Completed', false, 3)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Services
-- =============================================
INSERT INTO services (title, icon, short_description, description, features, display_order) VALUES
  ('IT Support', 'Headphones', 'Professional IT support and troubleshooting', 'Comprehensive IT support services including hardware, software, and network troubleshooting.', 'Remote Support\nOn-site Assistance\nSystem Maintenance\nUser Training', 1),
  ('Network Engineering', 'Network', 'Network design, configuration, and optimization', 'Expert network engineering services for optimal performance and security.', 'Network Design\nFirewall Configuration\nVPN Setup\nPerformance Optimization', 2),
  ('Mobile App Development', 'Smartphone', 'Cross-platform mobile applications with Flutter', 'Custom mobile application development using Flutter for iOS and Android.', 'UI/UX Design\nFrontend Development\nAPI Integration\nApp Store Deployment', 3),
  ('Technical Consultation', 'MessageSquare', 'Expert technology consulting services', 'Strategic technology consulting to help businesses make informed decisions.', 'Technology Assessment\nInfrastructure Planning\nSecurity Audit\nDigital Transformation', 4)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Education
-- =============================================
INSERT INTO education (degree, institution, location, start_date, end_date, description, display_order) VALUES
  ('Computer Science / IT', 'University Name', 'City, Country', '2019-09-01', '2023-06-01', 'Bachelor degree in Computer Science or Information Technology.', 1)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: Social Links
-- =============================================
INSERT INTO social_links (platform, url, username, display_order) VALUES
  ('LinkedIn', 'https://linkedin.com/in/yourprofile', 'yourprofile', 1),
  ('GitHub', 'https://github.com/yourusername', 'yourusername', 2),
  ('Email', 'mailto:contact@example.com', 'contact@example.com', 3)
ON CONFLICT DO NOTHING;

-- =============================================
-- SEED DATA: SEO Settings
-- =============================================
INSERT INTO seo_settings (page_slug, meta_title, meta_description, keywords) VALUES
  ('home', 'Asem - IT Support Specialist | Network Engineer | Mobile Developer', 'Professional portfolio showcasing IT support, network engineering, and mobile development expertise.', 'IT support, network engineer, mobile developer, portfolio'),
  ('about', 'About Me - Asem', 'Learn about my background, skills, and professional journey in technology.', 'about, background, experience, skills'),
  ('projects', 'Projects - Asem', 'Explore my portfolio of IT, networking, and mobile development projects.', 'projects, portfolio, web development, mobile apps'),
  ('contact', 'Contact - Asem', 'Get in touch for IT support, network engineering, or mobile development services.', 'contact, hire, freelance, IT support')
ON CONFLICT DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;

-- Public read policies for published content
CREATE POLICY "Public can view published skills" ON skills FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published experiences" ON experiences FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published certifications" ON certifications FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view project images" ON project_images FOR SELECT USING (true);
CREATE POLICY "Public can view published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published education" ON education FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view published social links" ON social_links FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public can view profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public can view SEO settings" ON seo_settings FOR SELECT USING (true);

-- Admin policies (authenticated users can do everything)
CREATE POLICY "Admin can manage skills" ON skills FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage experiences" ON experiences FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage certifications" ON certifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage projects" ON projects FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage project images" ON project_images FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage education" ON education FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage social links" ON social_links FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage site settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage profiles" ON profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage contact messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin can manage SEO settings" ON seo_settings FOR ALL USING (auth.role() = 'authenticated');

-- Contact form insert policy (anyone can submit)
CREATE POLICY "Anyone can submit contact messages" ON contact_messages FOR INSERT WITH CHECK (true);

-- =============================================
-- STORAGE BUCKETS
-- =============================================
INSERT INTO storage.buckets (id, name, public) VALUES
  ('profile-images', 'profile-images', true),
  ('project-images', 'project-images', true),
  ('certificates', 'certificates', true),
  ('cv-files', 'cv-files', true),
  ('site-assets', 'site-assets', true)
ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public can view profile images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "Public can view project images" ON storage.objects FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "Public can view certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Public can view site assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Authenticated can upload profile images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can upload project images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can upload certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can upload CV files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cv-files' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can upload site assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated can delete files" ON storage.objects FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can update files" ON storage.objects FOR UPDATE USING (auth.role() = 'authenticated');
