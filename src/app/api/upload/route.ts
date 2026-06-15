export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { put } from '@vercel/blob'
import { rateLimiters } from '@/lib/ratelimit'
import { fileTypeFromBuffer } from 'file-type'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // Rate limit — 5 uploads per hour per user
    const { success } = await rateLimiters.upload.limit(userId)
    if (!success) {
      return NextResponse.json(
        { error: 'Too many uploads. Please try again later.' },
        { status: 429 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB.' }, { status: 400 })
    }

    const allowedMimes: Record<string, string> = {
      'application/pdf':                                                      'pdf',
      'application/msword':                                                   'doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    }

    // Detect real file type from magic bytes — client-reported MIME is untrusted
    const buffer = Buffer.from(await file.arrayBuffer())
    const detected = await fileTypeFromBuffer(buffer)

    if (!detected || !(detected.mime in allowedMimes)) {
      return NextResponse.json({ error: 'Only PDF and Word files are accepted.' }, { status: 400 })
    }

    const ext = allowedMimes[detected.mime]
    const filename = `resumes/resume_${userId}_${Date.now()}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: detected.mime,
    })

    // Save to user profile
    await connectDB()
    await User.findByIdAndUpdate(userId, { resumeUrl: blob.url }, { new: true })

    return NextResponse.json({ url: blob.url })
  } catch (err: any) {
    console.error('Upload error:', err.message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}