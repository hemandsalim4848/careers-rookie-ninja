'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './apply.module.css'

export default function ApplyPage() {
  const { id } = useParams<{ id: string }>()
  const { data: session, status } = useSession()
  const router = useRouter()

  const [profile, setProfile]       = useState<any>(null)
  const [job, setJob]               = useState<any>(null)
  const [loading, setLoading]       = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]           = useState('')
  const [submitted, setSubmitted]   = useState(false)

  // Form fields
  const [coverLetter,       setCoverLetter]       = useState('')
  const [location,          setLocation]          = useState('')
  const [experience,        setExperience]        = useState('')
  const [travelWillingness, setTravelWillingness] = useState('')
  const [education,         setEducation]         = useState('')
  const [currentSalary,     setCurrentSalary]     = useState('')
  const [expectedSalary,    setExpectedSalary]    = useState('')
  const [noticePeriod,      setNoticePeriod]      = useState('')
  // UAE specific
  const [basedInUAE,        setBasedInUAE]        = useState('')
  const [emirate,           setEmirate]           = useState('')
  const [uaeDrivingLicense, setUaeDrivingLicense] = useState('')

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?redirect=/jobs/${id}/apply`)
    }
  }, [status])

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch(`/api/jobs/${id}`).then(r => r.json()),
    ]).then(([prof, j]) => {
      setProfile(prof)
      setJob(j)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, session])

  const isDubai = job?.location === 'Dubai'

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
        job:               id,
        resumeUrl:         profile.resumeUrl,
        phone:             profile.phone    ?? '',
        linkedIn:          profile.linkedIn ?? '',
        coverLetter,
        location,
        experience,
        travelWillingness,
        education,
        currentSalary,
        expectedSalary,
        noticePeriod,
        ...(isDubai && { basedInUAE, emirate, uaeDrivingLicense }),
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

  if (status === 'loading' || !session) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )

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
            Applying for <strong>{job?.title}</strong> · {job?.department}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* ── AUTO-FILLED INFO ── */}
            <div className={styles.autoFillSection}>
              <p className={styles.autoFillLabel}>Your details</p>
              <div className={styles.autoFillGrid}>
  <div className={styles.autoFillField}>
    <label className={styles.label}>Full name</label>
    <input value={session?.user?.name ?? ''} readOnly className={styles.readOnly} />
  </div>
  <div className={styles.autoFillField}>
    <label className={styles.label}>Email</label>
    <input value={session?.user?.email ?? ''} readOnly className={styles.readOnly} />
  </div>
  <div className={styles.autoFillField}>
    <label className={styles.label}>Phone number</label>
    <input value={profile?.phone ?? 'Not provided'} readOnly className={styles.readOnly} />
  </div>
</div>
            </div>

            {/* ── RESUME ── */}
            <div className={styles.field}>
              <label className={styles.label}>Your resume</label>
              {profile?.resumeUrl ? (
                <div className={styles.resumePreview}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span>Resume on file</span>
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>View ↗</a>
                  <Link href="/dashboard/seeker" className={styles.updateLink}>Update in profile</Link>
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

            <hr className={styles.divider} />

            {/* ── UNIVERSAL FIELDS ── */}
            <div className={styles.sectionHeading}>Application details</div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Current location <span className={styles.req}>*</span></label>
                <input
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Dubai, Chennai, London"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Years of IT Sales/Distribution experience <span className={styles.req}>*</span></label>
                <select required value={experience} onChange={e => setExperience(e.target.value)}>
                  <option value="">Select</option>
                  <option>Less than 1 year</option>
                  <option>1–2 years</option>
                  <option>3–5 years</option>
                  <option>6–10 years</option>
                  <option>10+ years</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Highest education level <span className={styles.req}>*</span></label>
                <select required value={education} onChange={e => setEducation(e.target.value)}>
                  <option value="">Select</option>
                  <option>High School / Secondary</option>
                  <option>Diploma</option>
                  <option>Bachelor's Degree</option>
                  <option>Master's Degree</option>
                  <option>PhD / Doctorate</option>
                  <option>Other</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Willingness to travel <span className={styles.req}>*</span></label>
                <select required value={travelWillingness} onChange={e => setTravelWillingness(e.target.value)}>
                  <option value="">Select</option>
                  <option>25%</option>
                  <option>50%</option>
                  <option>75%</option>
                  <option>100%</option>
                </select>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.label}>Current monthly salary <span className={styles.req}>*</span></label>
                <input
                  required
                  value={currentSalary}
                  onChange={e => setCurrentSalary(e.target.value)}
                  placeholder="e.g. AED 8,000 or INR 50,000"
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Expected monthly salary <span className={styles.req}>*</span></label>
                <input
                  required
                  value={expectedSalary}
                  onChange={e => setExpectedSalary(e.target.value)}
                  placeholder="e.g. AED 12,000 or INR 80,000"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>How soon can you join? <span className={styles.req}>*</span></label>
              <select required value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)}>
                <option value="">Select</option>
                <option>Immediately</option>
                <option>2 weeks</option>
                <option>1 month</option>
                <option>2 months</option>
                <option>3 months</option>
                <option>More than 3 months</option>
              </select>
            </div>

            {/* ── UAE SPECIFIC ── */}
            {isDubai && (
              <>
                <hr className={styles.divider} />
                <div className={styles.sectionHeading}>
                  UAE details
                  <span className={styles.sectionBadge}>Dubai role</span>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Are you currently based in the UAE? <span className={styles.req}>*</span></label>
                    <select required value={basedInUAE} onChange={e => setBasedInUAE(e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Do you have a valid UAE Driving License? <span className={styles.req}>*</span></label>
                    <select required value={uaeDrivingLicense} onChange={e => setUaeDrivingLicense(e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Emirate <span className={styles.req}>*</span></label>
                  <select required value={emirate} onChange={e => setEmirate(e.target.value)}>
                    <option value="">Select emirate</option>
                    <option>Abu Dhabi</option>
                    <option>Ajman</option>
                    <option>Dubai</option>
                    <option>Fujairah</option>
                    <option>Ras Al Khaimah</option>
                    <option>Sharjah</option>
                    <option>Umm Al Quwain</option>
                  </select>
                </div>
              </>
            )}

            <hr className={styles.divider} />

            {/* ── COVER LETTER ── */}
            <div className={styles.field}>
              <label htmlFor="cover" className={styles.label}>
                Cover letter <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="cover"
                rows={6}
                placeholder="Tell us why you're a great fit for this role…"
                value={coverLetter}
                onChange={e => setCoverLetter(e.target.value)}
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