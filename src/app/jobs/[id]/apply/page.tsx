'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './apply.module.css'

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session } = useSession()
  const router = useRouter()

  const [profile, setProfile]       = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [submitted, setSubmitted]   = useState(false)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile?.resumeUrl) {
      setError('Please upload your resume in your dashboard first.')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job:         id,
        resumeUrl:   profile.resumeUrl,
        phone:       profile.phone    ?? '',
        linkedIn:    profile.linkedIn ?? '',
        coverLetter: (document.getElementById('cover') as HTMLTextAreaElement)?.value ?? '',
      }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
    } else {
      setSubmitted(true)
    }
  }

  if (loading) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )

  if (submitted) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <div className={styles.successIcon}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          </div>
          <h1 className={styles.successTitle}>Application submitted!</h1>
          <p className={styles.successSub}>We'll be in touch soon. Track your status in your dashboard.</p>
          <Link href="/dashboard/seeker" className="btn-primary">View my applications</Link>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href={`/jobs/${id}`} className={styles.back}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Back to job
        </Link>

        <div className={styles.card}>
          <h1 className={styles.heading}>Submit your application</h1>
          <p className={styles.sub}>
            Applying as <strong>{session?.user?.name}</strong> · {session?.user?.email}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Resume preview */}
            <div className={styles.field}>
              <label className={styles.label}>Your resume</label>
              {profile?.resumeUrl ? (
                <div className={styles.resumePreview}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span>Resume on file</span>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
  View ↗
</a>
                  <Link href="/dashboard/seeker" className={styles.updateLink}>
                    Update in profile
                  </Link>
                </div>
              ) : (
                <div className={styles.noResume}>
                  <p>No resume found.</p>
                  <Link href="/dashboard/seeker" className="btn-primary" style={{ fontSize: 13 }}>
                    Upload in dashboard →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile info preview */}
            {(profile?.phone || profile?.linkedIn) && (
              <div className={styles.field}>
                <label className={styles.label}>Your profile info</label>
                <div className={styles.profilePreview}>
                  {profile.phone    && <span>📞 {profile.phone}</span>}
                  {profile.linkedIn && <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>LinkedIn ↗</a>}
                </div>
              </div>
            )}

            {/* Cover letter */}
            <div className={styles.field}>
              <label htmlFor="cover" className={styles.label}>
                Cover letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="cover"
                rows={6}
                placeholder="Tell us why you're a great fit for this role…"
                className={styles.textarea}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button
              type="submit"
              className={`btn-primary ${styles.submitBtn}`}
              disabled={submitting || !profile?.resumeUrl}
            >
              {submitting ? 'Submitting…' : 'Submit application'}
              {!submitting && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}