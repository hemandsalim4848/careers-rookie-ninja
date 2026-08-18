import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import Job from '@/models/Job'
import User from '@/models/User'
import { isValidObjectId } from 'mongoose'
import { getResumeTypeFromUrl } from '@/lib/resume'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  // jobId is required — never expose all applications across HR accounts
  if (!jobId) {
    return NextResponse.json({ error: 'jobId is required.' }, { status: 400 })
  }

  if (!isValidObjectId(jobId)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Verify job ownership before exporting
  const job = await Job.findById(jobId).lean()
  if (!job || String((job as any).postedBy) !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const query = { job: jobId }
  const applications = await Application.find(query)
    .populate('seeker', 'name email')
    .populate('job', 'title department minimumScore')
    .lean()

  if (applications.length === 0) {
    return new NextResponse('No applications found', { status: 404 })
  }

const rows = applications.map((a: any) => ({
  Name:               a.seeker?.name       ?? '',
  Email:              a.seeker?.email      ?? '',
  Job:                a.job?.title         ?? '',
  Department:         a.job?.department    ?? '',
  Phone:              a.phone              ?? '',
  LinkedIn:           a.linkedIn           ?? '',
  Location:           a.location           ?? '',
  Experience:         a.experience         ?? '',
  Education:          a.education          ?? '',
  'Travel %':         a.travelWillingness  ?? '',
  'Current Salary':   a.currentSalary      ?? '',
  'Expected Salary':  a.expectedSalary     ?? '',
  'Notice Period':    a.noticePeriod       ?? '',
  'Based in UAE':     a.basedInUAE         ?? '',
  Emirate:            a.emirate            ?? '',
  'UAE Driving Lic':  a.uaeDrivingLicense  ?? '',
  Score:              a.totalScore ?? 0,
  'Minimum Score':    a.job?.minimumScore ?? 0,
  'Meets Minimum':    (a.job?.minimumScore ?? 0) > 0
                        ? ((a.totalScore ?? 0) >= a.job.minimumScore ? 'Yes' : 'No')
                        : '',
  Status:             a.status,
  Applied:            new Date(a.createdAt).toLocaleDateString('en-AE'),
  'Resume Type':      getResumeTypeFromUrl(a.resumeUrl),
}))

  const sanitizeCell = (v: string) =>
    /^[=+\-@\t\r]/.test(v) ? `'${v}` : v

  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => `"${sanitizeCell(String((row as any)[h])).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="applicants-${jobId ?? 'all'}.csv"`,
    },
  })
}