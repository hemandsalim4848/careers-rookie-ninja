import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'
import { sanitizeText } from '@/lib/sanitize'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'hr') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await connectDB()
  const body = await req.json()
  const userId = (session.user as any).id

  // Password change
  if (body.currentPassword && body.newPassword) {
    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 })

    const valid = await bcrypt.compare(body.currentPassword, user.password)
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 })

    const hashed = await bcrypt.hash(body.newPassword, 12)
    await User.findByIdAndUpdate(userId, { $set: { password: hashed } })

    return NextResponse.json({ success: true })
  }

  // Profile update
  if (body.name || body.email) {
    const update: Record<string, string> = {}
    if (body.name)  update.name  = sanitizeText(body.name)
    if (body.email) update.email = sanitizeText(body.email.toLowerCase())

    // Check if email already taken
    if (body.email) {
      const existing = await User.findOne({ email: body.email.toLowerCase(), _id: { $ne: userId } })
      if (existing) return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
    }

    await User.findByIdAndUpdate(userId, { $set: update })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
}