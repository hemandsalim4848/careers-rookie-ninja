import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/mongodb'
import Job from '@/models/Job'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://careers.rookie-ninja.com'

  await connectDB()
  const jobs = await Job.find({ status: 'open' }, { _id: 1, updatedAt: 1 }).lean()

  const jobEntries: MetadataRoute.Sitemap = jobs.map(job => ({
    url:          `${base}/jobs/${job._id}`,
    lastModified: job.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...jobEntries,
  ]
}
