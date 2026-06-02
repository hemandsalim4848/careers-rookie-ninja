# careers.rookie-ninja.com

A Next.js 14 careers platform for Rookie Ninja — built with MongoDB + NextAuth.

## Tech stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14 (App Router) |
| Auth | NextAuth.js v4 (Credentials provider) |
| Database | MongoDB Atlas + Mongoose |
| File uploads | AWS S3 (resumes/CVs) |
| Email | Nodemailer + Resend/SendGrid SMTP |
| CSV export | json2csv |
| Forms | react-hook-form + zod |
| Styling | CSS Modules + custom design system |
| Fonts | Syne (display) + DM Sans (body) |
| Accent color | #15A7DC |

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
# NextAuth
NEXTAUTH_SECRET=your-random-secret-here
NEXTAUTH_URL=http://localhost:3000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/careers-rookie-ninja

# AWS S3 (for resume uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-south-1
AWS_S3_BUCKET=rookie-ninja-resumes

# Email (Nodemailer)
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=your-resend-api-key
HR_EMAIL=hr@rookie-ninja.com
```

### 3. Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── page.tsx                        # Job listings (public)
│   ├── layout.tsx                      # Root layout + Navbar + Footer
│   ├── globals.css                     # Design tokens & global styles
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── jobs/
│   │   └── [id]/
│   │       ├── page.tsx                # Job detail
│   │       └── apply/page.tsx          # Application form (auth required)
│   ├── dashboard/
│   │   ├── seeker/page.tsx             # Seeker: my applications
│   │   └── hr/
│   │       ├── page.tsx                # HR overview
│   │       ├── jobs/page.tsx           # Post / edit / delete jobs
│   │       └── applications/page.tsx   # View all applicants
│   └── api/
│       ├── auth/
│       │   ├── [...nextauth]/route.ts  # NextAuth handler
│       │   └── register/route.ts       # POST — create account
│       ├── jobs/route.ts               # GET (public), POST/PATCH/DELETE (HR)
│       ├── applications/
│       │   ├── route.ts                # POST (seeker), GET (HR)
│       │   └── export/route.ts         # CSV download (HR)
│       └── upload/route.ts             # Resume upload → S3
├── components/
│   ├── Navbar.tsx / .module.css
│   ├── Footer.tsx / .module.css
│   └── JobCard.tsx / .module.css
├── lib/
│   ├── mongodb.ts                      # Connection singleton
│   ├── auth.ts                         # NextAuth config
│   ├── mailer.ts                       # Nodemailer helpers
│   └── mockData.ts                     # Dev seed data
└── models/
    ├── User.ts
    ├── Job.ts
    └── Application.ts
```

---

## Pages overview

| Route | Access | Description |
|---|---|---|
| `/` | Public | Job listings with filters |
| `/jobs/[id]` | Public | Job detail + apply CTA |
| `/jobs/[id]/apply` | Seeker (auth) | Application form |
| `/auth/login` | Public | Login |
| `/auth/register` | Public | Register (seeker or HR) |
| `/dashboard/seeker` | Seeker (auth) | View own applications |
| `/dashboard/hr` | HR (auth) | HR overview stats |
| `/dashboard/hr/jobs` | HR (auth) | Post / edit / delete jobs |
| `/dashboard/hr/applications` | HR (auth) | All applicants per job |

---

## Design system

- **Accent:** `#15A7DC`
- **Background:** `#080E17` (base) → `#0D1520` → `#111C2A`
- **Display font:** Syne (Google Fonts)
- **Body font:** DM Sans (Google Fonts)
- **Border radius:** 6 / 10 / 16 / 24px scale

---

## Next steps (backend)

1. **MongoDB models** — `User`, `Job`, `Application` in `src/models/`
2. **NextAuth config** — credentials provider + role-based callbacks
3. **API routes** — jobs CRUD, application submit, CSV export
4. **Apply form** — resume upload to S3 + form submission
5. **HR dashboard** — applicant table with status update + email notification
6. **Middleware** — protect `/dashboard/hr/*` and `/api/jobs` (POST/PATCH/DELETE)
