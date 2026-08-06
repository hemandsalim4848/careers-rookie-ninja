export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { rateLimiters } from '@/lib/ratelimit'
import { fileTypeFromBuffer } from 'file-type'

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId:     process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

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

    // Upload to Cloudflare R2
    await r2.send(new PutObjectCommand({
      Bucket:      process.env.R2_BUCKET!,
      Key:         filename,
      Body:        buffer,
      ContentType: detected.mime,
    }))

    const url = `${process.env.R2_PUBLIC_URL}/${filename}`

    // Save to user profile
    await connectDB()
    await User.findByIdAndUpdate(userId, { resumeUrl: url }, { new: true })

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('Upload error:', err.message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}