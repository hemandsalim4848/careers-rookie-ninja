import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { sanitizeQuestionnaire, sanitizeMinimumScore } from '@/lib/questionnaire'
import { generateSlug } from '@/lib/slug'

// GET — public for open jobs; status=all requires HR session
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  if (status === 'all') {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'hr') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  await connectDB()
  const query = status === 'all' ? {} : { status: 'open' }

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json(jobs)
}

// POST — HR only, create a job
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const sanitizedBody = {
    title:            sanitizeText(body.title ?? ''),
    department:       sanitizeText(body.department ?? ''),
    location:         sanitizeText(body.location ?? ''),
    type:             body.type ?? 'Full-time',
    remote:           Boolean(body.remote),
    currency:         body.currency ?? 'AED',
    salaryMin:        body.salaryMin === '' || body.salaryMin == null ? undefined : Number(body.salaryMin),
    salaryMax:        body.salaryMax === '' || body.salaryMax == null ? undefined : Number(body.salaryMax),
    description:      sanitizeRichText(body.description ?? ''),
    responsibilities: (body.responsibilities ?? []).map((r: string) => sanitizeText(r)),
    requirements:     (body.requirements ?? []).map((r: string) => sanitizeText(r)),
    targetMarkets:    sanitizeText(body.targetMarkets ?? ''),
    niceToHave:       (body.niceToHave ?? []).map((r: string) => sanitizeText(r)),
    questionnaire:    sanitizeQuestionnaire(body.questionnaire),
    minimumScore:     sanitizeMinimumScore(body.minimumScore),
  }

  const job = await Job.create({ ...sanitizedBody, postedBy: session.user.id })

  // Generate slug after creation (need the _id)
  job.slug = generateSlug(job.title, job._id.toString())
  await job.save()

  return NextResponse.json(job, { status: 201 })
}