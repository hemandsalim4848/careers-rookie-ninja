# careers.rookie-ninja.com

## Project context

A Next.js 14 careers platform for Rookie Ninja, a technology distribution company in Dubai/UAE.

**Live site:** https://careers-rookie-ninja.vercel.app  
**Repo:** https://github.com/hemandsalim4848/careers-rookie-ninja

---

## Key decisions

- **Auth:** NextAuth JWT, HR accounts created via `scripts/createHR.ts` only (no public HR register)
- **DB:** MongoDB Atlas (prod) / localhost (dev)
- **File storage:** Vercel Blob (resumes, PDF/DOC/DOCX, max 5MB)
- **Email:** Nodemailer + Resend SMTP — domain unverified, all emails currently go to `HR_EMAIL`
- **Rate limiting:** Upstash Redis
- **Theme:** Black & white — accent `#000000`, background `#FFFFFF`
- **Font:** Poppins (all weights)

---

## Roles

| Role | How created | Access |
|---|---|---|
| `seeker` | Public register at `/auth/register` | Apply for jobs, view own applications |
| `hr` | Via `scripts/createHR.ts` only | Full dashboard, manage jobs & applicants |

---

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth.js v4 (Credentials + JWT) |
| Database | MongoDB Atlas + Mongoose |
| File uploads | Vercel Blob |
| Email | Nodemailer + Resend SMTP |
| Rate limiting | Upstash Redis |
| Sanitization | Custom regex sanitizer (`src/lib/sanitize.ts`) |
| Styling | CSS Modules + custom design tokens |
| Font | Poppins (Google Fonts) |
| Charts | Recharts (HR analytics dashboard) |

---

## Environment variables

```env
# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/careers-rookie-ninja

# Vercel Blob
BLOB_READ_WRITE_TOKEN=

# Email (Resend SMTP)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=
HR_EMAIL=

# Upstash Redis
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

---

## Project structure

src/
├── app/
│   ├── page.tsx                          # Job listings (public) with filters + pagination
│   ├── layout.tsx                        # Root layout + Navbar + Footer + AuthProvider
│   ├── globals.css                       # Design tokens & global styles
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx             # Seeker only — phone validation included
│   ├── jobs/
│   │   └── [id]/
│   │       ├── page.tsx                  # Job detail + already-applied check
│   │       └── apply/page.tsx            # Application form (auth required)
│   ├── dashboard/
│   │   ├── seeker/page.tsx               # My applications + resume management
│   │   └── hr/
│   │       ├── page.tsx                  # HR analytics dashboard (Recharts)
│   │       ├── jobs/page.tsx             # Post / edit / close / delete jobs
│   │       ├── jobs/new/page.tsx         # New job form
│   │       ├── jobs/[id]/edit/page.tsx   # Edit job form
│   │       ├── applications/page.tsx     # Applicants table + drawer + pagination + CSV
│   │       └── settings/page.tsx         # HR account settings
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts
│       │   └── register/route.ts
│       ├── jobs/route.ts
│       ├── jobs/[id]/route.ts
│       ├── applications/route.ts
│       ├── applications/[id]/route.ts
│       ├── applications/export/route.ts  # CSV export
│       ├── upload/route.ts               # Resume → Vercel Blob
│       ├── profile/route.ts              # GET/PATCH seeker profile
│       └── hr/settings/route.ts          # HR name/email/password update
├── components/
│   ├── Navbar.tsx                        # Sticky, role-aware, hamburger on mobile
│   ├── Footer.tsx
│   ├── JobCard.tsx
│   ├── AuthProvider.tsx                  # SessionProvider wrapper
│   └── ResumeSetupModal.tsx              # First-login resume upload popup
├── lib/
│   ├── mongodb.ts                        # Connection singleton
│   ├── auth.ts                           # NextAuth config + role callbacks
│   ├── mailer.ts                         # notifyHR + notifyApplicant
│   ├── ratelimit.ts                      # Upstash rate limiters
│   └── sanitize.ts                       # XSS sanitization helpers
├── models/
│   ├── User.ts                           # name, email, password, role, phone, linkedIn, resumeUrl
│   ├── Job.ts                            # title, dept, location, type, remote, salary, targetMarkets...
│   └── Application.ts                    # job, seeker, resumeUrl, coverLetter, experience, UAE fields...
├── types/
│   └── next-auth.d.ts                    # Session type extensions
├── middleware.ts                          # Route protection for /dashboard & /apply
└── scripts/
└── createHR.ts                       # CLI tool to create HR accounts



---

## Pages overview

| Route | Access | Description |
|---|---|---|
| `/` | Public | Job listings — search, filters (dept, type, location, remote), pagination |
| `/jobs/[id]` | Public | Job detail — full description, apply CTA, already-applied badge |
| `/jobs/[id]/apply` | Seeker | Application form — auto-fill name/email, UAE fields for Dubai jobs |
| `/auth/login` | Public | Login |
| `/auth/register` | Public | Register as seeker — phone validation included |
| `/dashboard/seeker` | Seeker | My applications, resume upload/update, status stats |
| `/dashboard/hr` | HR | Analytics — charts, stats, quick links |
| `/dashboard/hr/jobs` | HR | Manage job listings |
| `/dashboard/hr/jobs/new` | HR | Post new job |
| `/dashboard/hr/jobs/[id]/edit` | HR | Edit job |
| `/dashboard/hr/applications` | HR | Applicants table — expandable drawer, status update, CSV export |
| `/dashboard/hr/settings` | HR | Update name, email, password |

---

## Job locations
- Dubai
- India

UAE-specific fields (`basedInUAE`, `emirate`, `uaeDrivingLicense`) only appear in the apply form when `job.location === 'Dubai'`.

---

## Creating an HR account

```bash
# Point .env.local to Atlas URI first, then:
npx ts-node scripts/createHR.ts "Name" email@example.com Password123
# Switch .env.local back to localhost after
```

---

## Running locally

```bash
npm install
npm run dev
```

---

## Pending / future work

- SEO metadata per job page (waiting for `careers.rookie-ninja.com` domain)
- Custom domain setup
- Resend domain verification → enable emails to real recipients
- HR notes on applicants
- Social share buttons on job listings
- Seeker application confirmation email