# Asem Portfolio - Premium Personal Portfolio with Admin CMS

A complete, production-ready personal portfolio website with a private Admin CMS/dashboard. Built with Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, and Supabase.

## Features

### Public Website
- Premium dark-first design with light mode support
- Responsive across all devices
- Smooth Framer Motion animations
- SEO optimized with dynamic metadata, JSON-LD, sitemap, and robots.txt
- Project detail pages with case study layout
- ATS-friendly CV page with print support
- Contact form with real email delivery via Resend
- Dark/Light/System theme switcher

### Admin CMS (`/admin`)
- Secure authentication (Email/Password + Google OAuth)
- Dashboard with statistics overview
- Complete CRUD for all content:
  - Profile management
  - Skills with categories and proficiency
  - Work experience timeline
  - Certifications
  - Projects with images and detailed fields
  - Services
  - Education
  - Social links
  - Contact message inbox
  - SEO settings per page
  - Global site settings
- Image upload to Supabase Storage
- Published/Draft/Hidden states
- Drag-and-drop reordering

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Email | Resend |
| Analytics | Vercel Analytics |
| Deployment | Vercel |

## Folder Structure

```
├── app/
│   ├── (public)/           # Public routes
│   │   ├── layout.tsx      # Public layout with nav/footer
│   │   ├── projects/       # Projects listing & detail pages
│   │   └── cv/             # ATS-friendly CV page
│   ├── admin/              # Admin CMS
│   │   ├── layout.tsx      # Admin layout with auth guard
│   │   ├── login/          # Login page
│   │   ├── page.tsx        # Dashboard
│   │   ├── profile/        # Profile management
│   │   ├── skills/         # Skills CRUD
│   │   ├── experience/     # Experience CRUD
│   │   ├── certifications/ # Certifications CRUD
│   │   ├── projects/       # Projects CRUD
│   │   ├── services/       # Services CRUD
│   │   ├── education/      # Education CRUD
│   │   ├── cv/             # CV management
│   │   ├── messages/       # Contact inbox
│   │   ├── social-links/   # Social links CRUD
│   │   ├── seo/            # SEO settings
│   │   └── settings/       # Site settings
│   ├── api/
│   │   ├── auth/callback/  # OAuth callback
│   │   ├── contact/        # Contact form submission
│   │   └── upload/         # File upload
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── not-found.tsx       # 404 page
│   ├── error.tsx           # Error boundary
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots.txt
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── admin/              # Admin components
│   ├── sections/           # Public page sections
│   ├── navigation.tsx      # Main navigation
│   ├── footer.tsx          # Footer
│   └── projects-filter.tsx # Project filtering
├── lib/
│   ├── utils.ts            # Utility functions
│   ├── seo.ts              # SEO utilities
│   ├── supabase/           # Supabase clients
│   └── types/              # TypeScript types
├── supabase/
│   └── schema.sql          # Database schema + RLS + seed data
├── middleware.ts            # Auth middleware
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

## Local Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- A Supabase project
- A Resend account

### 1. Clone and install

```bash
git clone <your-repo-url>
cd asem-portfolio
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Asem Portfolio
```

### 3. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Run the contents of `supabase/schema.sql`
4. This creates all tables, RLS policies, seed data, and storage buckets

### 4. Authentication Setup

#### Email/Password
1. In Supabase Dashboard → Authentication → Providers
2. Enable Email provider
3. Configure as needed

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback` (development)
   - `https://your-domain.vercel.app/api/auth/callback` (production)
4. In Supabase Dashboard → Authentication → Providers → Google
5. Enable Google provider
6. Add Client ID and Client Secret

### 5. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy

### Post-Deployment Checklist

1. Update Google OAuth redirect URIs with production domain
2. Update `NEXT_PUBLIC_SITE_URL` to production URL
3. Test authentication flow
4. Test contact form email delivery
5. Verify SEO (sitemap, robots.txt, meta tags)
6. Submit sitemap to Google Search Console

## Admin Dashboard

### Accessing the Dashboard

Navigate to `/admin` on your deployed site.

### First Time Setup

1. Create an account using Email/Password auth or Google OAuth
2. The first authenticated user becomes the admin
3. Complete your profile in the Admin Dashboard

### Managing Content

- **Profile**: Update your name, title, bio, and profile image
- **Skills**: Add/edit/delete skills with categories and proficiency levels
- **Experience**: Manage your work history timeline
- **Certifications**: Add professional certifications
- **Projects**: Create detailed project case studies with images
- **Services**: List services you offer
- **Education**: Add educational background
- **Messages**: View and manage contact form submissions
- **Social Links**: Manage all social media links
- **SEO**: Configure meta tags for each page
- **Settings**: Update site-wide settings

## How to Add a Project

1. Go to `/admin/projects`
2. Click "Add Project"
3. Fill in all required fields:
   - Project name (slug auto-generates)
   - Short description
   - Full description
   - Upload main image
   - Add technologies (comma-separated)
   - Select category and status
   - Add links (GitHub, live demo, etc.)
4. Click "Save"
5. The project appears on the public website immediately

## How to Add a Certification

1. Go to `/admin/certifications`
2. Click "Add Certification"
3. Fill in: name, organization, dates, credential details
4. Optionally upload certificate image
5. Save

## How to Update the CV

1. Go to `/admin/profile`
2. Update your profile information
3. Go to `/admin/education` and add education entries
4. Go to `/admin/skills` and ensure skills are up to date
5. The CV page at `/cv` automatically reflects all changes
6. Optionally upload a PDF CV file in Profile settings

## How to Manage Contact Messages

1. Go to `/admin/messages`
2. View new messages with unread badge
3. Click to read full message
4. Mark as read/unread
5. Archive or delete messages
6. Reply via email (click email link)

## Troubleshooting

### Build Errors
```bash
npm run build
```
Check TypeScript errors and fix them.

### Authentication Issues
- Verify Supabase URL and keys in `.env.local`
- Check Google OAuth redirect URIs
- Ensure RLS policies are properly set

### Contact Form Not Sending Email
- Verify Resend API key
- Check that `CONTACT_EMAIL` is set correctly
- Resend free tier: verify your email in Resend dashboard

### Images Not Loading
- Check Supabase Storage buckets are created
- Verify RLS policies allow public read
- Check `next.config.js` remote patterns

### Database Errors
- Re-run `supabase/schema.sql` in Supabase SQL Editor
- Check RLS policies in Supabase Dashboard → Authentication → Policies

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server only) |
| `RESEND_API_KEY` | Yes | Resend API key for email |
| `CONTACT_EMAIL` | Yes | Email to receive contact form submissions |
| `NEXT_PUBLIC_SITE_URL` | Yes | Production site URL |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name (defaults to "Asem Portfolio") |

## License

MIT
