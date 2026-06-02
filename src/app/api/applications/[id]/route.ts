import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { notifyApplicant } from '@/lib/mailer'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { status } = await req.json()

  const application = await Application.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  ).populate('seeker', 'name email').populate('job', 'title')

  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  notifyApplicant({
    to:       (application.seeker as any).email,
    name:     (application.seeker as any).name,
    jobTitle: (application.job as any).title,
    status,
  }).catch(console.error)

  return NextResponse.json(application)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const application = await Application.findByIdAndDelete(params.id)
  if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json({ success: true })
}