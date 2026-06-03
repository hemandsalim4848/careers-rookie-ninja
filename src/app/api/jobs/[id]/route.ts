import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { sanitizeText, sanitizeRichText } from '@/lib/sanitize'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  await connectDB()
  const job = await Job.findById(params.id).lean()
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
    ...(body.niceToHave   && {
      niceToHave: body.niceToHave.map((r: string) => sanitizeText(r))
    }),
  }

  const job = await Job.findByIdAndUpdate(params.id, sanitizedBody, { new: true })
  if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(job)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  await Job.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}