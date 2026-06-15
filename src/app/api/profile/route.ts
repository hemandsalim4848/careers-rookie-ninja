import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { sanitizeText } from '@/lib/sanitize'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  await connectDB()
  const user = await User.findById(userId).select('-password').lean()

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const userId = session.user.id

  const allowed = ['phone', 'linkedIn', 'resumeUrl', 'name']
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = sanitizeText(body[key])
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  ).select('-password').lean()

  return NextResponse.json(user)
}