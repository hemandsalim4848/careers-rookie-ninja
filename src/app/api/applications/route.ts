import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import Job from '@/models/Job'
import { isValidObjectId } from 'mongoose'
import { notifyHR } from '@/lib/mailer'
import { rateLimiters, getIP } from '@/lib/ratelimit'
import { sanitizeText } from '@/lib/sanitize'
import { processQuestionnaireAnswers } from '@/lib/questionnaire'
import { getResumeTypeFromUrl } from '@/lib/resume'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { searchParams } = new URL(req.url)
  const role = session.user.role
  const id   = session.user.id

  let query: Record<string, any> = {}

  if (role === 'hr') {
    const jobId = searchParams.get('jobId')
    if (jobId) {
      if (!isValidObjectId(jobId)) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
      }
      const job = await Job.findById(jobId).lean()
      if (!job || String((job as any).postedBy) !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }
      query.job = jobId
    } else {
      // Scope to only jobs owned by this HR — never expose cross-account data
      const ownedJobs = await Job.find({ postedBy: session.user.id }, { _id: 1 }).lean()
      query.job = { $in: ownedJobs.map((j: any) => j._id) }
    }
  } else {
    query.seeker = id
  }

  const applications = await Application.find(query)
    .populate('job', 'title department location type questionnaire minimumScore')
    .populate('seeker', 'name email')
    .sort({ createdAt: -1 })
    .lean()

  if (role === 'hr') {
    const sanitized = applications.map((app: any) => {
      const { resumeUrl, ...rest } = app
      return {
        ...rest,
        resumeType: getResumeTypeFromUrl(resumeUrl),
      }
    })
    return NextResponse.json(sanitized)
  }

  return NextResponse.json(applications)
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'seeker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limit by user ID
    const userId = session.user.id
    const { success } = await rateLimiters.applications.limit(userId)

    if (!success) {
      return NextResponse.json(
        { error: 'You are applying too fast. Please wait before submitting another application.' },
        { status: 429 }
      )
    }

    await connectDB()
    const body = await req.json()
    const seekerId = session.user.id

    let job = await Job.findOne({ slug: body.job }).lean()
    if (!job && isValidObjectId(body.job)) job = await Job.findById(body.job).lean()
    if (!job) return NextResponse.json({ error: 'Job not found.' }, { status: 404 })
    if ((job as any).status !== 'open') {
      return NextResponse.json({ error: 'This job is no longer accepting applications.' }, { status: 400 })
    }

    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const recentApplication = await Application.findOne({
      job:     (job as any)._id,
      seeker:  seekerId,
      createdAt: { $gte: sixMonthsAgo },
    }).lean()

    if (recentApplication) {
      const reapplyDate = new Date((recentApplication as any).createdAt)
      reapplyDate.setMonth(reapplyDate.getMonth() + 6)
      const formatted = reapplyDate.toLocaleDateString('en-AE', { day: 'numeric', month: 'long', year: 'numeric' })
      return NextResponse.json(
        { error: `You have already applied for this job. You can apply again after ${formatted}.` },
        { status: 409 }
      )
    }

    const questionnaire = (job as any).questionnaire ?? []
    const scored = processQuestionnaireAnswers(questionnaire, body.questionnaireAnswers)
    if ('error' in scored) {
      return NextResponse.json({ error: scored.error }, { status: 400 })
    }

    // Enforce minimum score threshold
    const minScore = (job as any).minimumScore ?? 0
    if (minScore > 0 && scored.totalScore < minScore) {
      return NextResponse.json(
        { error: 'Your answers do not meet the minimum score required for this role.' },
        { status: 400 }
      )
    }

    // Validate resumeUrl origin against R2 public domain to prevent SSRF
    if (body.resumeUrl) {
      try {
        const supplied = new URL(body.resumeUrl)
        const allowed  = new URL(process.env.R2_PUBLIC_URL!)
        if (supplied.origin !== allowed.origin) {
          return NextResponse.json({ error: 'Invalid resume URL.' }, { status: 400 })
        }
      } catch {
        return NextResponse.json({ error: 'Invalid resume URL.' }, { status: 400 })
      }
    }

    const application = await Application.create({
      job:                (job as any)._id,
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
      questionnaireAnswers: scored.answers,
      totalScore:           scored.totalScore,
      seeker:             seekerId,
    })

    notifyHR({
      applicantName:  session.user?.name ?? 'Someone',
      applicantEmail: session.user?.email ?? '',
      jobId:          body.job,
    }).catch(console.error)

    return NextResponse.json(application, { status: 201 })
  } catch (err: any) {
    console.error('Application error:', err.message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}