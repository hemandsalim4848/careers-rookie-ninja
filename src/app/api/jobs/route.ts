import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { generateSlug } from '@/lib/slug'

// GET — public, returns all open jobs
export async function GET(req: NextRequest) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')

  // If status=all or no status param from HR, return everything
  const query = status === 'all' ? {} : { status: 'open' }

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean()
  return NextResponse.json(jobs)
}

// POST — HR only, create a job
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  const sanitizedBody = {
    ...body,
    title:            sanitizeText(body.title ?? ''),
    department:       sanitizeText(body.department ?? ''),
    location:         sanitizeText(body.location ?? ''),
    description:      sanitizeRichText(body.description ?? ''),
    responsibilities: (body.responsibilities ?? []).map((r: string) => sanitizeText(r)),
    requirements:     (body.requirements ?? []).map((r: string) => sanitizeText(r)),
    niceToHave:       (body.niceToHave ?? []).map((r: string) => sanitizeText(r)),
  }

  const job = await Job.create({ ...sanitizedBody, postedBy: (session.user as any).id })

  // Generate slug after creation (need the _id)
  job.slug = generateSlug(job.title, job._id.toString())
  await job.save()

  return NextResponse.json(job, { status: 201 })
}