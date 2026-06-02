import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = (session.user as any).id
    console.log('Upload - session user id:', userId)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 })

    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Only PDF and Word files are accepted.' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File must be under 5MB.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop()
    const filename = `${randomUUID()}.${ext}`

    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes')
    await mkdir(uploadDir, { recursive: true })
    await writeFile(join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    const url = `/uploads/resumes/${filename}`
    console.log('File saved at:', url)

    await connectDB()
    console.log('Looking for user with id:', userId)
const userCheck = await User.findById(userId).lean()
console.log('User found before update:', userCheck ? 'yes' : 'no')
    const updated = await User.findByIdAndUpdate(
      userId,
      { resumeUrl: url },
      { new: true }
    )
    console.log('User after update:', updated?._id, 'resumeUrl:', updated?.resumeUrl)

    if (!updated) {
      return NextResponse.json({ error: 'User not found in DB.' }, { status: 404 })
    }

    return NextResponse.json({ url })
  } catch (err: any) {
    console.error('Upload error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}