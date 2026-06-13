import Link from 'next/link'
import styles from './JobCard.module.css'

interface JobCardProps {
  _id: string
  slug?: string  
  title: string
  department: string
  location: string
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
  remote: boolean
  salaryMin?: number
  salaryMax?: number
  currency?: string
  postedAt: string
  applicationCount?: number
  isNew?: boolean
}

const TYPE_COLORS: Record<string, string> = {
  'Full-time':  'tag-green',
  'Part-time':  'tag-amber',
  'Contract':   'tag-gray',
  'Internship': 'tag-accent',
}

function formatSalary(min?: number, max?: number, currency = 'USD') {
  if (!min && !max) return null
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency', currency, maximumFractionDigits: 0,
    }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

function timeAgo(date: string) {
  if (!date) return ''
  const diff = Date.now() - new Date(date).getTime()
  if (isNaN(diff)) return ''
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return `${Math.floor(days / 30)}mo ago`
}

export default function JobCard({
  _id, slug, title, department, location, type, remote,
  salaryMin, salaryMax, currency, postedAt, isNew,
}: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax, currency)

  return (
    <Link href={`/jobs/${slug || _id}`} className={styles.card}>
      {/* Top row */}
      <div className={styles.header}>
        <div className={styles.dept}>{department}</div>
        <div className={styles.meta}>
          {isNew && <span className="tag tag-accent">New</span>}
          <span className={styles.time}>{timeAgo(postedAt)}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className={styles.title}>{title}</h3>

      {/* Tags row */}
      <div className={styles.tags}>
        <span className={`tag ${TYPE_COLORS[type] ?? 'tag-gray'}`}>{type}</span>
        {remote && <span className="tag tag-accent">Remote</span>}
        <span className="tag tag-gray">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          {location}
        </span>
        {salary && (
          <span className="tag tag-gray">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v8M8.5 10h4a1.5 1.5 0 1 1 0 3h-3a1.5 1.5 0 1 0 0 3H13"/>
            </svg>
            {salary}
          </span>
        )}
      </div>

      {/* Arrow */}
      <div className={styles.arrow} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </div>
    </Link>
  )
}
