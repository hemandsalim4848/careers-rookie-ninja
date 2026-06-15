import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { rateLimiters } from '@/lib/ratelimit'

function validatePhone(phone: string): string | null {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (!cleaned.startsWith('+')) return 'Phone must start with country code'
  if (cleaned.length < 10) return 'Phone number is too short'
  if (cleaned.length > 16) return 'Phone number is too long'
  if (!/^\+\d+$/.test(cleaned)) return 'Invalid phone number format'
  return null
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'anonymous'
    const { success } = await rateLimiters.auth.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many attempts. Please try again in 10 minutes.' }, { status: 429 })
    }

    const { name, email, password, phone } = await req.json()

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const phoneErr = validatePhone(phone)
    if (phoneErr) {
      return NextResponse.json({ error: phoneErr }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await User.create({
      name,
      email:    email.toLowerCase(),
      password: hashed,
      role:     'seeker',
      phone,
    })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    console.error('Register error:', err.message)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}