import { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'
import JobDetailClient from './JobDetailClient'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    await connectDB()
    const job = await Job.findById(params.id).lean() as any
    if (!job) return {}

    const title = `${job.title} — ${job.department}`
    const description = job.description?.slice(0, 160) ?? `${job.title} at Rookie Ninja. ${job.location} · ${job.type}.`

    return {
      title,
      description,
      alternates: { canonical: `/jobs/${params.id}` },
      openGraph: {
        title,
        description,
        url: `/jobs/${params.id}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    }
  } catch {
    return {}
  }
}

export default function JobDetailPage() {
  return <JobDetailClient />
}
