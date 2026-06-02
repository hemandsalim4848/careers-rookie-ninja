import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'

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

  const job = await Job.create({ ...body, postedBy: (session.user as any).id })
  return NextResponse.json(job, { status: 201 })
}