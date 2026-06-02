import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { notifyHR } from '@/lib/mailer'

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
    console.log('Session:', session)

    if (!session || (session.user as any).role !== 'seeker') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    console.log('DB connected')

    const body = await req.json()
    console.log('Application body:', body)

    const seekerId = (session.user as any).id

    const application = await Application.create({ ...body, seeker: seekerId })
    console.log('Application created:', application._id)

    notifyHR({
      applicantName:  session.user?.name ?? 'Someone',
      applicantEmail: session.user?.email ?? '',
      jobId:          body.job,
    }).catch(console.error)

    return NextResponse.json(application, { status: 201 })
  } catch (err: any) {
    console.error('Application error:', err.message)
    console.error(err.stack)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}