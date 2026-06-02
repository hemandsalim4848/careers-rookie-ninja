'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './hr.module.css'

export default function HROverview() {
  const [jobs, setJobs]     = useState<any[]>([])
  const [apps, setApps]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([j, a]) => { setJobs(j); setApps(a); setLoading(false) })
  }, [])

  const stats = [
    { label: 'Open roles',      value: jobs.filter(j => j.status === 'open').length,        color: 'tag-green'  },
    { label: 'Total applicants',value: apps.length,                                          color: 'tag-accent' },
    { label: 'Shortlisted',     value: apps.filter(a => a.status === 'shortlisted').length,  color: 'tag-accent' },
    { label: 'Hired',           value: apps.filter(a => a.status === 'hired').length,        color: 'tag-green'  },
  ]

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>HR Dashboard</h1>
            <p className={styles.sub}>Overview of all roles and applications</p>
          </div>
          <Link href="/dashboard/hr/jobs/new" className="btn-primary">
            + Post new job
          </Link>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={`tag ${s.color}`}>{s.label}</span>
              <p className={styles.statNum}>{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        {/* Quick links */}
        <div className={styles.quickLinks}>
          <Link href="/dashboard/hr/jobs" className={styles.quickCard}>
            <div className={styles.quickIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div>
              <p className={styles.quickTitle}>Manage Jobs</p>
              <p className={styles.quickSub}>Post, edit, or close roles</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          <Link href="/dashboard/hr/applications" className={styles.quickCard}>
            <div className={styles.quickIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <p className={styles.quickTitle}>View Applicants</p>
              <p className={styles.quickSub}>Review, shortlist, and hire</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}