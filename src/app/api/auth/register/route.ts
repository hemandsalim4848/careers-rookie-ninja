import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'
import { rateLimiters, getIP } from '@/lib/ratelimit'

export async function POST(req: NextRequest) {
  try {
    // Rate limit by IP
    const ip = getIP(req)
    const { success, limit, remaining } = await rateLimiters.auth.limit(ip)

    if (!success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again in 10 minutes.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit':     limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
          },
        }
      )
    }

    const { name, email, password } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    await connectDB()

    const existing = await User.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'Email already registered.' }, { status: 409 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await User.create({ name, email: email.toLowerCase(), password: hashed, role: 'seeker' })

    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err: any) {
    console.error('Register error:', err.message)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}