import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import Application from '@/models/Application'
import { getResumeMime, getResumeTypeFromUrl } from '@/lib/resume'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const application = await Application.findById(params.id).select('resumeUrl').lean()

  if (!application || !(application as any).resumeUrl) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const resumeUrl = (application as any).resumeUrl as string
  const resumeType = getResumeTypeFromUrl(resumeUrl)
  const forceDownload =
    req.nextUrl.searchParams.get('download') === '1' ||
    resumeType === 'doc' ||
    resumeType === 'docx'

  let blobRes: Response
  try {
    blobRes = await fetch(resumeUrl)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch resume' }, { status: 502 })
  }

  if (!blobRes.ok || !blobRes.body) {
    return NextResponse.json({ error: 'Resume unavailable' }, { status: 502 })
  }

  const ext = resumeType === 'unknown' ? 'bin' : resumeType
  const filename = `resume.${ext}`
  const contentType =
    blobRes.headers.get('content-type') || getResumeMime(resumeType)

  const headers = new Headers({
    'Content-Type': contentType,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'private, no-store',
    'Content-Disposition': forceDownload
      ? `attachment; filename="${filename}"`
      : `inline; filename="${filename}"`,
  })

  return new NextResponse(blobRes.body, { status: 200, headers })
}
