import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function GET() {
  await connectDB()
  
  const existing = await User.findOne({ email: 'hemandsalim4848@gmail.com' })
  if (existing) {
    return NextResponse.json({ error: 'User already exists', role: existing.role })
  }

  const hashed = await bcrypt.hash('Test@123', 12)
  const user = await User.create({
    name: 'HR',
    email: 'hemandsalim4848@gmail.com',
    password: hashed,
    role: 'hr',
  })

  return NextResponse.json({ success: true, id: user._id })
}