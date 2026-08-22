import { ArrowUpRight, Check, ExternalLink, Github, Mail, MapPin, Network, Phone, Server, Smartphone } from "lucide-react";
import { generatePersonSchema } from "@/lib/seo";
import { staticCertifications, staticEducation, staticExperiences, staticProfile, staticProjects, staticServices, staticSkills, staticSocialLinks } from "@/lib/static-data";

const socialIcons: Record<string, typeof Github> = { GitHub: Github, Email: Mail };

const skillGroups = Array.from(new Set(staticSkills.map((skill) => skill.category))).map((category) => ({
  category,
  skills: staticSkills.filter((skill) => skill.category === category),
}));

const capabilities = [
  { number: "01", icon: Server, title: "Product development", description: "Turning ideas into clear web products with sensible architecture, useful interfaces, and maintainable code." },
  { number: "02", icon: Smartphone, title: "Mobile experiences", description: "Designing and building cross-platform applications that feel focused, reliable, and ready to grow." },
  { number: "03", icon: Network, title: "Technical foundations", description: "Supporting the systems behind the product with practical troubleshooting and dependable technical decisions." },
] as const;

export function TechnicalPortfolio() {
  const jsonLd = generatePersonSchema();

  return (
    <main className="technical-shell">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section id="home" className="technical-hero technical-frame">
        <div className="technical-hero-line" />
        <div className="technical-hero-copy">
          <p className="technical-eyebrow"><span className="technical-eyebrow-line" /> Web development · mobile products · technical systems</p>
          <p className="technical-founder-note">Founder of ORA Soft <span>·</span> developing products with purpose</p>
          <h1>I build products<span>people can use.</span></h1>
          <p className="technical-lead">{staticProfile.about}</p>
          <div className="technical-actions">
            <a href="#projects" className="technical-button technical-button-primary">Explore selected work <ArrowUpRight size={16} /></a>
            <a href="/cv" className="technical-button technical-button-light">View qualifications <ArrowUpRight size={16} /></a>
          </div>
          <div className="technical-proof">
            <div><strong>{staticProjects.length}</strong><span>selected builds</span></div>
            <div><strong>{staticSkills.length}</strong><span>technical skills</span></div>
            <div><strong>{staticExperiences.length}</strong><span>professional tracks</span></div>
          </div>
        </div>
        <div className="technical-portrait-wrap">
          <div className="technical-portrait-card">
            <div className="technical-portrait-meta"><span>ASEM AL-MANARI</span><span>SOFTWARE & SYSTEMS</span></div>
            <div className="technical-portrait-image"><img src={staticProfile.profile_image} alt="Asem Al-Manari" width="460" height="460" fetchPriority="high" decoding="async" /></div>
            <div className="technical-portrait-footer"><span>{staticProfile.location}</span><span>ORA Soft · Founder</span></div>
          </div>
        </div>
      </section>

      <section id="about" className="technical-section technical-frame technical-manifesto">
        <div className="technical-section-kicker"><span>01</span><span>Profile</span></div>
        <div className="technical-two-column">
          <h2>Useful technology should feel <em>clear.</em></h2>
          <div className="technical-copy">
            <p>{staticProfile.about}</p>
            <p>My work sits between software development, mobile products, technical support, and product thinking. I bring structure to the hard parts and keep the visible experience direct.</p>
            <a href="#contact" className="technical-text-link">Start a conversation <ArrowUpRight size={15} /></a>
          </div>
        </div>
      </section>

      <section id="skills" className="technical-section technical-frame">
        <div className="technical-section-kicker"><span>02</span><span>Technical range</span></div>
        <div className="technical-heading-row">
          <div><p className="technical-eyebrow">The tools are only the beginning</p><h2>Depth across<br /><span>the whole build.</span></h2></div>
          <p className="technical-section-intro">From web applications and mobile products to the technical foundations behind them, I work across the layers that make an idea useful.</p>
        </div>
        <div className="technical-capability-grid">
          {capabilities.map(({ number, icon: Icon, title, description }) => (
            <article key={number} className="technical-capability-card"><span className="technical-card-number">{number}</span><Icon size={23} strokeWidth={1.5} /><h3>{title}</h3><p>{description}</p></article>
          ))}
        </div>
        <div className="technical-skills-panel">
          <div className="technical-panel-heading"><span>Working toolkit</span><small>Selected by the problem, not the trend</small></div>
          <div className="technical-skills-grid">
            {skillGroups.map((group) => <div key={group.category}><span className="technical-skill-category">{group.category}</span><strong>{group.skills.map((skill) => skill.name).join(" · ")}</strong><small>{group.skills.map((skill) => skill.description).join(" · ")}</small></div>)}
          </div>
        </div>
      </section>

      <section id="experience" className="technical-section technical-frame">
        <div className="technical-section-kicker"><span>03</span><span>Experience</span></div>
        <div className="technical-heading-row technical-heading-border"><div><p className="technical-eyebrow">Work with a practical bias</p><h2>Experience that stays<br /><span>close to the problem.</span></h2></div><p className="technical-section-intro">A record of development and technical support work shaped by real operational needs and useful outcomes.</p></div>
        <div className="technical-timeline">
          {staticExperiences.map((experience) => <article key={experience.id} className="technical-timeline-item"><div className="technical-timeline-date">{experience.start_date ? String(experience.start_date).slice(0, 4) : ""} — {experience.is_current ? "Present" : experience.end_date ? String(experience.end_date).slice(0, 4) : ""}</div><div><h3>{experience.job_title}</h3><p className="technical-timeline-company">{experience.company} · {experience.location}</p><p>{experience.description}</p><p className="technical-timeline-responsibilities">{experience.responsibilities}</p><div className="technical-tags">{experience.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div></article>)}
        </div>
      </section>

      <section id="education" className="technical-section technical-frame technical-split-section">
        <div className="technical-section-kicker"><span>04</span><span>Education</span></div>
        <div className="technical-heading-row"><div><p className="technical-eyebrow">Foundations matter</p><h2>Education &<br /><span>certification.</span></h2></div><div className="technical-education-list">{staticEducation.map((item) => <article key={item.id}><span>{item.start_date?.slice(0, 4)} — {item.end_date?.slice(0, 4)}</span><h3>{item.degree}</h3><p>{item.institution} · {item.location}</p><small>{item.description}</small></article>)}{staticCertifications.map((item) => <article key={item.id}><span>{item.issue_date?.slice(0, 4)} · Certification</span><h3>{item.name}</h3><p>{item.issuing_organization}</p><small>{item.description}</small></article>)}</div></div>
      </section>

      <section id="projects" className="technical-section technical-frame">
        <div className="technical-section-kicker"><span>05</span><span>Proof of work</span></div>
        <div className="technical-heading-row technical-heading-border"><div><p className="technical-eyebrow">Selected systems</p><h2>Built for<br /><span>the real world.</span></h2></div><p className="technical-section-intro">A selection of web, mobile, infrastructure, and founder-led products. Each project keeps the technical decisions close to the user&apos;s actual needs.</p></div>
        <div className="technical-project-list">
          {staticProjects.map((project, index) => <TechnicalProjectCard key={project.id} project={project} featured={index < 2} />)}
        </div>
        <div className="technical-all-work"><span>{staticProjects.length} selected systems · static portfolio</span><a href="https://github.com/bassamdev711/asem-portfolio" target="_blank" rel="noreferrer" className="technical-text-link">View source <ExternalLink size={15} /></a></div>
      </section>

      <section id="orasoft" className="technical-section technical-frame technical-ora-section">
        <div className="technical-section-kicker"><span>06</span><span>Founder-led company</span></div>
        <div className="technical-heading-row technical-heading-border"><div><p className="technical-eyebrow">Asem Al-Manari · Founder</p><h2>ORA Soft —<br /><span>software with purpose.</span></h2></div><div className="technical-ora-copy"><p>ORA Soft helps ambitious businesses turn ideas, products, and daily operations into clear digital systems that can launch, grow, and improve.</p><p className="technical-ora-services">Product discovery · UX/UI · Web platforms · Mobile apps · Digital operations</p><div className="technical-actions"><a href="https://orasoft.vercel.app/" target="_blank" rel="noreferrer" className="technical-button technical-button-primary">Visit ORA Soft <ExternalLink size={15} /></a><a href="https://orasoft.vercel.app/work" target="_blank" rel="noreferrer" className="technical-button technical-button-outline">View company work <ArrowUpRight size={15} /></a></div></div></div>
        <div className="technical-ora-gallery"><div className="technical-ora-row technical-ora-row-large">{["website-importance-comparison.webp", "brand-message.webp"].map((file) => <a key={file} href={`/orasoft/${file}`} target="_blank" rel="noreferrer"><img src={`/optimized/${file}`} alt={`ORA Soft ${file.replace(".webp", "")}`} loading="lazy" decoding="async" /></a>)}</div><div className="technical-ora-row technical-ora-row-small">{["services-promo.webp", "phone-promo.webp", "laptop-hero.webp", "future-business.webp"].map((file) => <a key={file} href={`/orasoft/${file}`} target="_blank" rel="noreferrer"><img src={`/optimized/${file}`} alt={`ORA Soft ${file.replace(".webp", "")}`} loading="lazy" decoding="async" /></a>)}</div></div>
      </section>

      <section id="services" className="technical-section technical-frame">
        <div className="technical-section-kicker"><span>07</span><span>Services</span></div>
        <div className="technical-heading-row technical-heading-border"><div><p className="technical-eyebrow">How I can help</p><h2>Focused support for<br /><span>useful systems.</span></h2></div><p className="technical-section-intro">Web development, mobile products, technical support, and practical consultation for people who want dependable work.</p></div>
        <div className="technical-services-grid">{staticServices.map((service, index) => <article key={service.id}><span className="technical-card-number">0{index + 1}</span><h3>{service.title}</h3><p>{service.description}</p><div className="technical-service-features">{service.features.split("\n").map((feature) => <span key={feature}><Check size={14} />{feature}</span>)}</div></article>)}</div>
      </section>

      <section id="contact" className="technical-section technical-frame technical-contact-section">
        <div className="technical-contact-panel"><div className="technical-contact-topline"><span>08 / Contact</span><span>Available for the right challenge</span></div><div className="technical-contact-content"><p className="technical-eyebrow"><span className="technical-eyebrow-line" /> Start a conversation</p><h2>Have a complex idea?<br /><span>Let&apos;s give it shape.</span></h2><p>Whether you need a practical digital product, a mobile experience, or technical support that brings clarity to the problem, I&apos;d be glad to hear what you&apos;re building.</p><a href={`mailto:${staticProfile.email}`} className="technical-button technical-button-light">{staticProfile.email} <ArrowUpRight size={17} /></a></div><div className="technical-contact-links"><a href={staticSocialLinks[0].url} target="_blank" rel="noreferrer"><Github size={17} /> GitHub</a><a href={`mailto:${staticProfile.email}`}><Mail size={17} /> Email</a>{staticProfile.phone && <a href={`tel:${staticProfile.phone}`}><Phone size={17} /> {staticProfile.phone}</a>}<span><MapPin size={17} /> {staticProfile.location}</span></div></div>
      </section>

    </main>
  );
}

function TechnicalProjectCard({ project, featured }: { project: (typeof staticProjects)[number]; featured: boolean }) {
  return (
    <article className={`technical-project-card ${featured ? "technical-project-featured" : ""}`}>
      <div className="technical-project-visual">
        {project.main_image ? <img src={project.main_image} alt={project.name} loading="lazy" decoding="async" /> : <div className="technical-project-placeholder"><span>{project.category}</span><strong>{project.name.slice(0, 2).toUpperCase()}</strong></div>}
        <div className="technical-project-label">{project.category} · {project.status}</div>
      </div>
      <div className="technical-project-details"><div className="technical-project-topline"><span>{project.slug}</span><span>{String(project.display_order).padStart(2, "0")}</span></div><h3>{project.name}</h3><p className="technical-project-kicker">{project.short_description}</p><p className="technical-project-description">{project.description}</p><p className="technical-project-impact"><Check size={15} /> {project.results}</p><div className="technical-project-bottom"><div className="technical-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div><div className="technical-project-links"><a href={`/projects/${project.slug}`} className="technical-text-link">Case study <ArrowUpRight size={15} /></a>{project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" aria-label={`${project.name} live site`}><ExternalLink size={17} /></a>}</div></div></div>
    </article>
  );
}
