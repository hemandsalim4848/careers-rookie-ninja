'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './jobs.module.css'


export default function HRJobsPage() {
  const { data: session, status } = useSession()
const router = useRouter()
  const [jobs, setJobs]     = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  if (status === 'unauthenticated') {
    router.push('/auth/login')
  } else if (status === 'authenticated' && (session?.user as any)?.role !== 'hr') {
    router.push('/')
  }
}, [status, session])

if (status === 'loading' || !session) return (
  <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
)

  useEffect(() => {
    fetch('/api/jobs?status=all')
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false) })
  }, [])

  async function toggleStatus(id: string, current: string) {
    const next = current === 'open' ? 'closed' : 'open'
    await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next }),
    })
    setJobs(prev => prev.map(j => j._id === id ? { ...j, status: next } : j))
  }

  async function deleteJob(id: string) {
    if (!confirm('Delete this job? This cannot be undone.')) return
    await fetch(`/api/jobs/${id}`, { method: 'DELETE' })
    setJobs(prev => prev.filter(j => j._id !== id))
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Manage Jobs</h1>
            <p className={styles.sub}>{jobs.length} total listings</p>
          </div>
          <Link href="/dashboard/hr/jobs/new" className="btn-primary">+ Post new job</Link>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Loading…</p>
        ) : jobs.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No jobs posted yet</p>
            <Link href="/dashboard/hr/jobs/new" className="btn-primary" style={{ marginTop: 12 }}>Post your first job</Link>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Role</span>
              <span>Type</span>
              <span>Status</span>
              <span>Posted</span>
              <span>Actions</span>
            </div>
            {jobs.map(job => (
  <div key={job._id} className={`${styles.tableRow} ${job.status === 'closed' ? styles.tableRowClosed : ''}`}>
    <div>
      <p className={styles.jobTitle}>{job.title}</p>
      <p className={styles.jobDept}>{job.department} · {job.location}</p>
      {job.status === 'closed' && (
        <p className={styles.closedNote}>This job is hidden from applicants</p>
      )}
    </div>
    <span className="tag tag-gray">{job.type}</span>
    <span className={`tag ${job.status === 'open' ? 'tag-green' : 'tag-gray'}`}>
      {job.status === 'open' ? 'Open' : 'Closed'}
    </span>
    <span className={styles.date}>
      {new Date(job.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
    </span>
    <div className={styles.actions}>
      {job.status === 'open' && (
        <Link href={`/dashboard/hr/jobs/${job.slug || job._id}/edit`} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>Edit</Link>
      )}
      <button
        className="btn-ghost"
        style={{ fontSize: 12, padding: '6px 12px' }}
        onClick={() => toggleStatus(job._id, job.status)}
      >
        {job.status === 'open' ? 'Close' : 'Reopen'}
      </button>
      <Link href={`/dashboard/hr/applications?jobId=${job._id}`}
        className="btn-ghost"
        style={{ fontSize: 12, padding: '6px 12px' }}
      >
        Applicants
      </Link>
      <button className={styles.deleteBtn} onClick={() => deleteJob(job._id)}>
        Delete
      </button>
    </div>
  </div>
))}
          </div>
        )}
      </div>
    </div>
  )
}