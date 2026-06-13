import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'
import { generateSlug } from '@/lib/slug'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()

  // Try slug first, then fall back to MongoDB ID
  let job = await Job.findOne({ slug: params.id }).lean()
  if (!job) job = await Job.findById(params.id).lean()

  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()

  // Find by slug or ID
  let job = await Job.findOne({ slug: params.id })
  if (!job) job = await Job.findById(params.id)
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const sanitizedBody = {
    ...body,
    ...(body.title        && { title:        sanitizeText(body.title) }),
    ...(body.department   && { department:   sanitizeText(body.department) }),
    ...(body.location     && { location:     sanitizeText(body.location) }),
    ...(body.description  && { description:  sanitizeRichText(body.description) }),
    ...(body.responsibilities && {
      responsibilities: body.responsibilities.map((r: string) => sanitizeText(r))
    }),
    ...(body.requirements && {
      requirements: body.requirements.map((r: string) => sanitizeText(r))
    }),
    ...(body.niceToHave && {
      niceToHave: body.niceToHave.map((r: string) => sanitizeText(r))
    }),
  }

  // If title changed, regenerate slug
  if (body.title && body.title !== job.title) {
    sanitizedBody.slug = generateSlug(sanitizedBody.title, job._id.toString())
  }

  const updated = await Job.findByIdAndUpdate(job._id, sanitizedBody, { new: true })
  return NextResponse.json(updated)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()

  // Find by slug or ID
  let job = await Job.findOne({ slug: params.id })
  if (!job) job = await Job.findById(params.id)
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await Job.findByIdAndDelete(job._id)
  return NextResponse.json({ success: true })
}