# Asem Portfolio

A polished, static portfolio website for **Asem Alhakim**, presenting his work across IT support, networking, mobile development, web development, and founder-led digital products.

The project is built with Next.js, TypeScript, Tailwind CSS, Framer Motion, and reusable UI components. It is intentionally **static**: content is stored in `lib/static-data.ts`, contact requests open the visitor's email client, and the site does not require a database, authentication provider, API routes, or server-side environment secrets.

## Included sections

The homepage includes a hero introduction, about section, skills, experience, education, certifications, selected projects, the Aura Soft / Orasoft founder section, services, and contact details. The project archive at `/projects` supports local search and filtering, while `/projects/[slug]` pages are generated from the static project data. The `/cv` route presents a printable CV and PDF actions using the same local data source.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

The site is available at `http://localhost:3000`.

## Production build

Run the production checks locally with:

```bash
npm run build
npm run start
```

No Supabase, Resend, authentication, or database configuration is required. The optional `.env.example` file only documents public site metadata used for canonical URLs and page titles.

## Content editing

Update the profile, skills, experience, education, certifications, projects, services, and social links in `lib/static-data.ts`. Images used by the Aura Soft section are stored in `public/orasoft/`. After editing content, run `npm run build` before pushing changes.

## Deployment

The project can be deployed directly to Vercel by connecting the GitHub repository. Every push to the production branch creates a new static deployment. No Supabase environment variables are needed.

## Repository

[github.com/bassamdev711/asem-portfolio](https://github.com/bassamdev711/asem-portfolio)
