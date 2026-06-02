import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  console.log('Profile GET - userId:', userId)

  await connectDB()
  const user = await User.findById(userId).select('-password').lean()
  console.log('Profile found:', user ? 'yes' : 'no', 'resumeUrl:', (user as any)?.resumeUrl)

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const body = await req.json()
  const userId = (session.user as any).id

  console.log('Profile PATCH - userId:', userId, 'body:', body)

  const allowed = ['phone', 'linkedIn', 'resumeUrl', 'name']
  const update: Record<string, any> = {}
  for (const key of allowed) {
    if (body[key] !== undefined) update[key] = body[key]
  }

  console.log('Updating with:', update)

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  ).select('-password').lean()

  console.log('Updated user resumeUrl:', (user as any)?.resumeUrl)

  return NextResponse.json(user)
}