'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './page.module.css'

function formatSalary(min?: number, max?: number, currency = 'AED') {
  if (!min && !max) return null
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)
  if (min && max) return `${fmt(min)} – ${fmt(max)}`
  if (min) return `From ${fmt(min)}`
  return `Up to ${fmt(max!)}`
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const router = useRouter()

  const [job, setJob]             = useState<any>(null)
  const [loading, setLoading]     = useState(true)
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => r.json())
      .then(data => { setJob(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  // Check if seeker already applied
  useEffect(() => {
    if (!session || (session.user as any).role !== 'seeker') return
    fetch('/api/applications')
      .then(r => r.json())
      .then((apps: any[]) => {
        const applied = apps.some(a => a.job?._id === id || a.job === id)
        setAlreadyApplied(applied)
      })
      .catch(() => {})
  }, [session, id])

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )

  if (!job || job.error) {
    return (
      <div className={styles.notFound}>
        <h2>Role not found</h2>
        <Link href="/" className="btn-ghost">← Back to jobs</Link>
      </div>
    )
  }

  const salary = formatSalary(job.salaryMin, job.salaryMax, job.currency)

  const handleApply = () => {
    if (!session) {
      router.push(`/auth/login?redirect=/jobs/${id}`)
    } else {
      router.push(`/jobs/${id}/apply`)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/" className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          All roles
        </Link>

        <div className={styles.layout}>
          <article className={styles.content}>
            <header className={styles.header}>
              <p className={styles.dept}>{job.department}</p>
              <h1 className={styles.title}>{job.title}</h1>
              <div className={styles.tagRow}>
                <span className={`tag ${job.type === 'Full-time' ? 'tag-green' : job.type === 'Internship' ? 'tag-accent' : 'tag-gray'}`}>
                  {job.type}
                </span>
                {job.remote && <span className="tag tag-accent">Remote</span>}
                <span className="tag tag-gray">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {job.location}
                </span>
                {salary && <span className="tag tag-gray">{salary}</span>}
              </div>
            </header>

            <hr className={styles.divider} />

            <section className={styles.section}>
  <h2 className={styles.sectionTitle}>About this role</h2>
  <p className={styles.body} style={{ whiteSpace: 'pre-wrap' }}>{job.description}</p>
</section>

            {job.responsibilities?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What you'll do</h2>
                <ul className={styles.list}>
                  {job.responsibilities.map((r: string, i: number) => (
                    <li key={i} className={styles.listItem}>
                      <span className={styles.listDot} />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.requirements?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>What we're looking for</h2>
                <ul className={styles.list}>
                  {job.requirements.map((r: string, i: number) => (
                    <li key={i} className={styles.listItem}>
                      <span className={styles.listDot} />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {job.targetMarkets && (
  <section className={styles.section}>
    <h2 className={styles.sectionTitle}>Target markets & industries</h2>
    <p className={styles.body} style={{ whiteSpace: 'pre-wrap' }}>{job.targetMarkets}</p>
  </section>
)}

            {job.niceToHave?.length > 0 && (
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Nice to have</h2>
                <ul className={styles.list}>
                  {job.niceToHave.map((r: string, i: number) => (
                    <li key={i} className={styles.listItem}>
                      <span className={`${styles.listDot} ${styles.listDotMuted}`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>

          <aside className={styles.sidebar}>
            <div className={styles.applyCard}>
              <p className={styles.applyCardTitle}>{job.title}</p>
              <p className={styles.applyCardSub}>{job.department} · {job.location}</p>
              {salary && <p className={styles.salaryDisplay}>{salary}</p>}

              {alreadyApplied ? (
                <div className={styles.appliedBadge}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5"/>
                  </svg>
                  Already applied
                </div>
              ) : (
                <button className={`btn-primary ${styles.applyBtn}`} onClick={handleApply}>
                  {session ? 'Apply now' : 'Sign in to apply'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              )}

              {!session && (
                <p className={styles.applyNote}>
                  <Link href="/auth/register" className={styles.applyNoteLink}>Create account</Link> — it's free.
                </p>
              )}

              <hr className={styles.cardDivider} />
              <dl className={styles.metaList}>
                <div className={styles.metaItem}><dt>Type</dt><dd>{job.type}</dd></div>
                <div className={styles.metaItem}><dt>Location</dt><dd>{job.location}</dd></div>
                {job.remote && <div className={styles.metaItem}><dt>Remote</dt><dd className={styles.metaGreen}>Yes</dd></div>}
                <div className={styles.metaItem}><dt>Department</dt><dd>{job.department}</dd></div>
              </dl>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}