import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import Job from '@/models/Job'
import { notifyHR } from '@/lib/mailer'
import { rateLimiters, getIP } from '@/lib/ratelimit'
import { sanitizeText } from '@/lib/sanitize'


export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { searchParams } = new URL(req.url)
  const role = (session.user as any).role
  const id   = (session.user as any).id

  let query: Record<string, any> = {}

  if (role === 'hr') {
    const jobId = searchParams.get('jobId')
    if (jobId) query.job = jobId
  } else {
    query.seeker = id
  }

  const applications = await Application.find(query)
    .populate('job', 'title department location type')
    .populate('seeker', 'name email')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || (session.user as any).role !== 'seeker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit by user ID
    const userId = (session.user as any).id
    const { success } = await rateLimiters.applications.limit(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'You are applying too fast. Please wait before submitting another application.' },
        { status: 429 }
      )
    }

    await connectDB()
    const body = await req.json()
    const seekerId = (session.user as any).id

    const job = await Job.findById(body.job).lean()
    if (!job) return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
    if ((job as any).status !== 'open') {
      return NextResponse.json({ error: 'This job is no longer accepting applications.' }, { status: 400 })
    }

    const application = await Application.create({
      job:                body.job,
      resumeUrl:          body.resumeUrl,
      coverLetter:        sanitizeText(body.coverLetter ?? ''),
      phone:              sanitizeText(body.phone ?? ''),
      linkedIn:           sanitizeText(body.linkedIn ?? ''),
      location:           sanitizeText(body.location ?? ''),
      experience:         sanitizeText(body.experience ?? ''),
      travelWillingness:  sanitizeText(body.travelWillingness ?? ''),
      education:          sanitizeText(body.education ?? ''),
      currentSalary:      sanitizeText(body.currentSalary ?? ''),
      expectedSalary:     sanitizeText(body.expectedSalary ?? ''),
      noticePeriod:       sanitizeText(body.noticePeriod ?? ''),
      basedInUAE:         sanitizeText(body.basedInUAE ?? ''),
      emirate:            sanitizeText(body.emirate ?? ''),
      uaeDrivingLicense:  sanitizeText(body.uaeDrivingLicense ?? ''),
      seeker:             seekerId,
    })

    notifyHR({
      applicantName:  session.user?.name ?? 'Someone',
      applicantEmail: session.user?.email ?? '',
      jobId:          body.job,
    }).catch(console.error)

    return NextResponse.json(application, { status: 201 })
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 409 })
    }
    console.error('Application error:', err.message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}