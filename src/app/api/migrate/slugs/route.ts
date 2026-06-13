export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import { generateSlug } from '@/lib/slug'

export async function GET() {
  await connectDB()

  const jobs = await Job.find({ slug: { $exists: false } })
  let updated = 0

  for (const job of jobs) {
    job.slug = generateSlug(job.title, job._id.toString())
    await job.save()
    updated++
  }

  return NextResponse.json({ success: true, updated })
}