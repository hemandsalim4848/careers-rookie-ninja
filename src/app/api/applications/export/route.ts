import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import Job from '@/models/Job'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get('jobId')

  const query = jobId ? { job: jobId } : {}
  const applications = await Application.find(query)
    .populate('seeker', 'name email')
    .populate('job', 'title department')
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
  Status:             a.status,
  Applied:            new Date(a.createdAt).toLocaleDateString('en-AE'),
  Resume:             a.resumeUrl,
}))

  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => `"${String((row as any)[h]).replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv',
      'Content-Disposition': `attachment; filename="applicants-${jobId ?? 'all'}.csv"`,
    },
  })
}