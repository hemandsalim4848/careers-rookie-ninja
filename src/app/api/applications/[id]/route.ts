import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import Job from '@/models/Job'
import { notifyApplicant } from '@/lib/mailer'

async function getApplicationOwnedByHR(applicationId: string, hrUserId: string) {
  const application = await Application.findById(applicationId).populate('job')
  if (!application) return null
  if (String((application.job as any).postedBy) !== hrUserId) return null
  return application
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { status } = await req.json()

  const VALID_STATUSES = ['pending', 'shortlisted', 'hired', 'rejected']
  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status value.' }, { status: 400 })
  }

  const owned = await getApplicationOwnedByHR(params.id, session.user.id)
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const application = await Application.findByIdAndUpdate(
    params.id,
    { status },
    { new: true, runValidators: true }
  ).populate('seeker', 'name email').populate('job', 'title')

  notifyApplicant({
    to:       (application!.seeker as any).email,
    name:     (application!.seeker as any).name,
    jobTitle: (application!.job as any).title,
    status,
  }).catch(console.error)

  return NextResponse.json(application)
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const owned = await getApplicationOwnedByHR(params.id, session.user.id)
  if (!owned) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await Application.findByIdAndDelete(params.id)
  return NextResponse.json({ success: true })
}