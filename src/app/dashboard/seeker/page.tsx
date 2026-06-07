'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ResumeSetupModal from '@/components/ResumeSetupModal'
import styles from './seeker.module.css'

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     cls: 'tag-gray'   },
  shortlisted: { label: 'Shortlisted', cls: 'tag-accent' },
  hired:       { label: 'Hired',       cls: 'tag-green'  },
  rejected:    { label: 'Rejected',    cls: 'tag-amber'  },
}

export default function SeekerDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [applications, setApplications] = useState<any[]>([])
  const [profile, setProfile]           = useState<any>(null)
  const [loading, setLoading]           = useState(true)
  const [showModal, setShowModal]       = useState(false)
  const [updatingResume, setUpdatingResume] = useState(false)
  const [resumeFile, setResumeFile]     = useState<File | null>(null)
  const [resumeError, setResumeError]   = useState('')
  const [resumeSuccess, setResumeSuccess] = useState(false)

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && (session?.user as any)?.role === 'hr') {
      router.push('/dashboard/hr')
    }
  }, [status, session])

  useEffect(() => {
    if (!session) return
    const isHR = (session.user as any)?.role === 'hr'

    fetch('/api/profile')
      .then(r => r.json())
      .then(prof => {
        setProfile(prof)
        if (!prof.resumeUrl && !isHR) {
          setShowModal(true)
          setLoading(false)
        } else {
          fetch('/api/applications')
            .then(r => r.json())
            .then(apps => {
              setApplications(Array.isArray(apps) ? apps : [])
              setLoading(false)
            })
            .catch(() => setLoading(false))
        }
      })
      .catch(() => setLoading(false))
  }, [session])

  function handleModalComplete(url: string) {
    setProfile((p: any) => ({ ...p, resumeUrl: url }))
    setShowModal(false)
    fetch('/api/applications')
      .then(r => r.json())
      .then(apps => setApplications(Array.isArray(apps) ? apps : []))
      .catch(() => {})
  }

  function handleModalSkip() {
    setShowModal(false)
    fetch('/api/applications')
      .then(r => r.json())
      .then(apps => setApplications(Array.isArray(apps) ? apps : []))
      .catch(() => {})
  }

  async function handleResumeUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!resumeFile) return
    setUpdatingResume(true)
    setResumeError('')
    setResumeSuccess(false)

    try {
      const fd = new FormData()
      fd.append('file', resumeFile)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      setProfile((p: any) => ({ ...p, resumeUrl: data.url }))
      setResumeFile(null)
      setResumeSuccess(true)
      setTimeout(() => setResumeSuccess(false), 3000)
    } catch (err: any) {
      setResumeError(err.message)
    } finally {
      setUpdatingResume(false)
    }
  }

  if (status === 'loading' || !session) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )

  return (
    <>
      {showModal && (
        <ResumeSetupModal
          onComplete={handleModalComplete}
          onSkip={handleModalSkip}
        />
      )}

      <div className={styles.page}>
        <div className="container">

          {/* Header */}
          <div className={styles.header}>
            <div>
              <h1 className={styles.heading}>My Dashboard</h1>
              <p className={styles.sub}>Welcome back, {session?.user?.name}</p>
            </div>
            <Link href="/" className="btn-primary">Browse jobs</Link>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading…</div>
          ) : (
            <>
              {/* ── PROFILE CARD ── */}
              <div className={styles.profileCard}>
                <div className={styles.profileLeft}>
                  <div className={styles.avatar}>
                    {session?.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className={styles.profileName}>{session?.user?.name}</p>
                    <p className={styles.profileEmail}>{session?.user?.email}</p>
                    {profile?.phone && <p className={styles.profileMeta}>{profile.phone}</p>}
                    {profile?.linkedIn && (
                      <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className={styles.linkedIn}>
                        LinkedIn ↗
                      </a>
                    )}
                  </div>
                </div>

                {/* Resume section */}
                <div className={styles.resumeSection}>
                  <p className={styles.resumeLabel}>My Resume</p>

                  {profile?.resumeUrl ? (
                    <div className={styles.resumeBox}>
                      <div className={styles.resumeFile}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                        <span>Current resume</span>
                        <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>
  View ↗
</a>
                      </div>

                      {/* Update resume */}
                      <form onSubmit={handleResumeUpdate} className={styles.updateForm}>
                        <label className={styles.fileInputLabel}>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            style={{ display: 'none' }}
                            onChange={e => setResumeFile(e.target.files?.[0] ?? null)}
                          />
                          <span className="btn-ghost" style={{ fontSize: 13, padding: '7px 14px', cursor: 'pointer' }}>
                            {resumeFile ? resumeFile.name : 'Choose new file'}
                          </span>
                        </label>
                        {resumeFile && (
                          <button type="submit" className="btn-primary" style={{ fontSize: 13, padding: '7px 14px' }} disabled={updatingResume}>
                            {updatingResume ? 'Updating…' : 'Update resume'}
                          </button>
                        )}
                      </form>
                      {resumeError   && <p className={styles.resumeError}>{resumeError}</p>}
                      {resumeSuccess && <p className={styles.resumeSuccess}>✓ Resume updated successfully</p>}
                    </div>
                  ) : (
                    <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowModal(true)}>
                      + Upload resume
                    </button>
                  )}
                </div>
              </div>

              {/* ── STATS ── */}
              <div className={styles.stats}>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <div key={key} className={styles.statCard}>
                    <span className={`tag ${cfg.cls}`}>{cfg.label}</span>
                    <p className={styles.statNum}>
                      {applications.filter(a => a.status === key).length}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── APPLICATIONS ── */}
              <h2 className={styles.sectionTitle}>My Applications</h2>

              {applications.length === 0 ? (
                <div className={styles.empty}>
                  <p className={styles.emptyTitle}>No applications yet</p>
                  <p className={styles.emptySub}>Start applying to open roles!</p>
                  <Link href="/" className="btn-primary" style={{ marginTop: 12 }}>Browse jobs</Link>
                </div>
              ) : (
                <div className={styles.list}>
                  {applications.map((app: any) => {
                    const status = STATUS_CONFIG[app.status as keyof typeof STATUS_CONFIG]
                    return (
                      <div key={app._id} className={styles.appCard}>
                        <div className={styles.appLeft}>
                          <p className={styles.appDept}>{app.job?.department}</p>
                          <p className={styles.appTitle}>{app.job?.title}</p>
                          <p className={styles.appMeta}>{app.job?.location} · {app.job?.type}</p>
                        </div>
                        <div className={styles.appRight}>
                          <span className={`tag ${status.cls}`}>{status.label}</span>
                          <p className={styles.appDate}>
                            Applied {new Date(app.createdAt).toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}