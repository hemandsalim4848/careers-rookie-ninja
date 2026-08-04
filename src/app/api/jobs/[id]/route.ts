import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { sanitizeQuestionnaire, sanitizeMinimumScore } from '@/lib/questionnaire'
import { generateSlug } from '@/lib/slug'
import { isValidObjectId } from 'mongoose'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  // Try slug first, then fall back to MongoDB ID
  let job = await Job.findOne({ slug: params.id }).lean()
  if (!job && isValidObjectId(params.id)) job = await Job.findById(params.id).lean()

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  // Find by slug or ID
  let job = await Job.findOne({ slug: params.id })
  if (!job && isValidObjectId(params.id)) job = await Job.findById(params.id)
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const update: Record<string, unknown> = {}

  if (body.title !== undefined)        update.title = sanitizeText(body.title)
  if (body.department !== undefined)   update.department = sanitizeText(body.department)
  if (body.location !== undefined)     update.location = sanitizeText(body.location)
  if (body.type !== undefined)         update.type = body.type
  if (body.remote !== undefined)       update.remote = Boolean(body.remote)
  if (body.currency !== undefined)     update.currency = body.currency
  if (body.salaryMin !== undefined)    update.salaryMin = body.salaryMin === '' || body.salaryMin == null ? undefined : Number(body.salaryMin)
  if (body.salaryMax !== undefined)    update.salaryMax = body.salaryMax === '' || body.salaryMax == null ? undefined : Number(body.salaryMax)
  if (body.description !== undefined)  update.description = sanitizeRichText(body.description)
  if (body.responsibilities !== undefined) {
    update.responsibilities = body.responsibilities.map((r: string) => sanitizeText(r))
  }
  if (body.requirements !== undefined) {
    update.requirements = body.requirements.map((r: string) => sanitizeText(r))
  }
  if (body.targetMarkets !== undefined) update.targetMarkets = sanitizeText(body.targetMarkets ?? '')
  if (body.niceToHave !== undefined) {
    update.niceToHave = body.niceToHave.map((r: string) => sanitizeText(r))
  }
  if (body.status !== undefined) update.status = body.status
  if (body.questionnaire !== undefined) {
    update.questionnaire = sanitizeQuestionnaire(body.questionnaire)
  }
  if (body.minimumScore !== undefined) {
    update.minimumScore = sanitizeMinimumScore(body.minimumScore)
  }

  // If title changed, regenerate slug
  if (body.title && body.title !== job.title) {
    update.slug = generateSlug(String(update.title ?? body.title), job._id.toString())
  }

  const updated = await Job.findByIdAndUpdate(
    job._id,
    { $set: update },
    { new: true, runValidators: true }
  )
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Find by slug or ID
  let job = await Job.findOne({ slug: params.id })
  if (!job && isValidObjectId(params.id)) job = await Job.findById(params.id)
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await Job.findByIdAndDelete(job._id)
  return NextResponse.json({ success: true })
}