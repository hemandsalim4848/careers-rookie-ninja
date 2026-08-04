'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import styles from './apply.module.css'

type Answers = Record<string, { selectedOptionIds: string[]; textAnswer: string }>

interface DraftData {
  step: number
  coverLetter: string
  location: string
  experience: string
  travelWillingness: string
  education: string
  currentSalary: string
  expectedSalary: string
  noticePeriod: string
  basedInUAE: string
  emirate: string
  uaeDrivingLicense: string
  answers: Answers
  savedAt: string
}

function draftKey(jobId: string, userId: string) {
  return `apply-draft:${jobId}:${userId}`
}

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
  const [saveMsg, setSaveMsg]       = useState('')
  const [step, setStep]             = useState(0)
  const [draftReady, setDraftReady] = useState(false)

  const [coverLetter,       setCoverLetter]       = useState('')
  const [location,          setLocation]          = useState('')
  const [experience,        setExperience]        = useState('')
  const [travelWillingness, setTravelWillingness] = useState('')
  const [education,         setEducation]         = useState('')
  const [currentSalary,     setCurrentSalary]     = useState('')
  const [expectedSalary,    setExpectedSalary]    = useState('')
  const [noticePeriod,      setNoticePeriod]      = useState('')
  const [basedInUAE,        setBasedInUAE]        = useState('')
  const [emirate,           setEmirate]           = useState('')
  const [uaeDrivingLicense, setUaeDrivingLicense] = useState('')
  const [answers, setAnswers] = useState<Answers>({})

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/auth/login?redirect=/jobs/${id}/apply`)
    }
  }, [status, id, router])

  useEffect(() => {
    if (!session) return
    Promise.all([
      fetch('/api/profile').then(r => r.json()),
      fetch(`/api/jobs/${id}`).then(r => r.json()),
    ]).then(([prof, j]) => {
      setProfile(prof)
      setJob(j)

      const init: Answers = {}
      for (const q of j?.questionnaire ?? []) {
        init[q.id] = { selectedOptionIds: [], textAnswer: '' }
      }

      // Restore draft from localStorage
      const userId = (session.user as any)?.id ?? session.user?.email ?? 'anon'
      try {
        const raw = localStorage.getItem(draftKey(id, userId))
        if (raw) {
          const draft: DraftData = JSON.parse(raw)
          setCoverLetter(draft.coverLetter ?? '')
          setLocation(draft.location ?? '')
          setExperience(draft.experience ?? '')
          setTravelWillingness(draft.travelWillingness ?? '')
          setEducation(draft.education ?? '')
          setCurrentSalary(draft.currentSalary ?? '')
          setExpectedSalary(draft.expectedSalary ?? '')
          setNoticePeriod(draft.noticePeriod ?? '')
          setBasedInUAE(draft.basedInUAE ?? '')
          setEmirate(draft.emirate ?? '')
          setUaeDrivingLicense(draft.uaeDrivingLicense ?? '')
          setAnswers({ ...init, ...(draft.answers ?? {}) })
          setStep(typeof draft.step === 'number' ? draft.step : 0)
        } else {
          setAnswers(init)
        }
      } catch {
        setAnswers(init)
      }

      setDraftReady(true)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, session])

  const isDubai = job?.location === 'Dubai'
  const questionnaire = job?.questionnaire ?? []

  const steps = useMemo(() => {
    const list: { key: string; label: string }[] = [
      { key: 'profile', label: 'Profile' },
      { key: 'details', label: 'Details' },
    ]
    if (isDubai) list.push({ key: 'uae', label: 'UAE' })
    if (questionnaire.length > 0) list.push({ key: 'questions', label: 'Questions' })
    list.push({ key: 'review', label: 'Review' })
    return list
  }, [isDubai, questionnaire.length])

  // Clamp step if steps change (e.g. non-Dubai job)
  useEffect(() => {
    if (!draftReady) return
    if (step >= steps.length) setStep(Math.max(0, steps.length - 1))
  }, [steps.length, step, draftReady])

  const currentKey = steps[step]?.key ?? 'profile'

  function getDraftPayload(nextStep = step): DraftData {
    return {
      step: nextStep,
      coverLetter,
      location,
      experience,
      travelWillingness,
      education,
      currentSalary,
      expectedSalary,
      noticePeriod,
      basedInUAE,
      emirate,
      uaeDrivingLicense,
      answers,
      savedAt: new Date().toISOString(),
    }
  }

  function saveDraft(nextStep = step, showToast = true) {
    if (!session) return
    const userId = (session.user as any)?.id ?? session.user?.email ?? 'anon'
    try {
      localStorage.setItem(draftKey(id, userId), JSON.stringify(getDraftPayload(nextStep)))
      if (showToast) {
        setSaveMsg('Progress saved. You can come back and continue later.')
        setTimeout(() => setSaveMsg(''), 3000)
      }
    } catch {
      setError('Could not save progress in this browser.')
    }
  }

  function clearDraft() {
    if (!session) return
    const userId = (session.user as any)?.id ?? session.user?.email ?? 'anon'
    localStorage.removeItem(draftKey(id, userId))
  }

  function setSingleOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedOptionIds: [optionId], textAnswer: '' },
    }))
  }

  function toggleMultiOption(questionId: string, optionId: string) {
    setAnswers((prev) => {
      const current = prev[questionId]?.selectedOptionIds ?? []
      const next = current.includes(optionId)
        ? current.filter((oid) => oid !== optionId)
        : [...current, optionId]
      return {
        ...prev,
        [questionId]: { selectedOptionIds: next, textAnswer: '' },
      }
    })
  }

  function setTextAnswer(questionId: string, text: string) {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: { selectedOptionIds: [], textAnswer: text },
    }))
  }

  function validateStep(key: string): string | null {
    if (key === 'profile') {
      if (!profile?.resumeUrl) return 'Please upload your resume in your dashboard first.'
      return null
    }
    if (key === 'details') {
      if (!location.trim()) return 'Please enter your current location.'
      if (!experience) return 'Please select your experience.'
      if (!education) return 'Please select your education level.'
      if (!travelWillingness) return 'Please select travel willingness.'
      if (!currentSalary.trim()) return 'Please enter your current salary.'
      if (!expectedSalary.trim()) return 'Please enter your expected salary.'
      if (!noticePeriod) return 'Please select how soon you can join.'
      return null
    }
    if (key === 'uae') {
      if (!basedInUAE) return 'Please answer whether you are based in the UAE.'
      if (!uaeDrivingLicense) return 'Please answer about your UAE driving license.'
      if (!emirate) return 'Please select your emirate.'
      return null
    }
    if (key === 'questions') {
      for (const q of questionnaire) {
        if (!q.required) continue
        const a = answers[q.id]
        if (q.type === 'text') {
          if (!a?.textAnswer?.trim()) return `Please answer: ${q.text}`
        } else if (!a?.selectedOptionIds?.length) {
          return `Please answer: ${q.text}`
        }
      }
      return null
    }
    return null
  }

  function goNext() {
    const err = validateStep(currentKey)
    if (err) {
      setError(err)
      return
    }
    setError('')
    const next = Math.min(step + 1, steps.length - 1)
    setStep(next)
    saveDraft(next, false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function goBack() {
    setError('')
    const prev = Math.max(step - 1, 0)
    setStep(prev)
    saveDraft(prev, false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSaveForLater() {
    setError('')
    saveDraft(step, true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!profile?.resumeUrl) {
      setError('Please upload your resume in your dashboard first.')
      return
    }

    for (const s of steps) {
      if (s.key === 'review') continue
      const err = validateStep(s.key)
      if (err) {
        setError(err)
        const idx = steps.findIndex((x) => x.key === s.key)
        if (idx >= 0) setStep(idx)
        return
      }
    }

    setSubmitting(true)
    setError('')

    const questionnaireAnswers = questionnaire.map((q: any) => ({
      questionId: q.id,
      selectedOptionIds: answers[q.id]?.selectedOptionIds ?? [],
      textAnswer: answers[q.id]?.textAnswer ?? '',
    }))

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
        questionnaireAnswers,
        ...(isDubai && { basedInUAE, emirate, uaeDrivingLicense }),
      }),
    })

    const data = await res.json()
    setSubmitting(false)

    if (!res.ok) {
      setError(data.error || 'Something went wrong.')
    } else {
      clearDraft()
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

          {/* Step indicator */}
          <div className={styles.stepper} aria-label="Application steps">
            {steps.map((s, i) => (
              <button
                key={s.key}
                type="button"
                className={`${styles.stepItem} ${i === step ? styles.stepActive : ''} ${i < step ? styles.stepDone : ''}`}
                onClick={() => {
                  // Only allow jumping back to completed steps
                  if (i <= step) {
                    setError('')
                    setStep(i)
                    saveDraft(i, false)
                  }
                }}
                disabled={i > step}
              >
                <span className={styles.stepNum}>{i < step ? '✓' : i + 1}</span>
                <span className={styles.stepLabel}>{s.label}</span>
              </button>
            ))}
          </div>
          <p className={styles.stepProgress}>
            Step {step + 1} of {steps.length}
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* ── STEP: PROFILE ── */}
            {currentKey === 'profile' && (
              <>
                <div className={styles.sectionHeading}>Your profile</div>
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
              </>
            )}

            {/* ── STEP: DETAILS ── */}
            {currentKey === 'details' && (
              <>
                <div className={styles.sectionHeading}>Application details</div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Current location <span className={styles.req}>*</span></label>
                    <input
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Dubai, Chennai, London"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Years of IT Sales/Distribution experience <span className={styles.req}>*</span></label>
                    <select value={experience} onChange={e => setExperience(e.target.value)}>
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
                    <select value={education} onChange={e => setEducation(e.target.value)}>
                      <option value="">Select</option>
                      <option>High School / Secondary</option>
                      <option>Diploma</option>
                      <option>Bachelor&apos;s Degree</option>
                      <option>Master&apos;s Degree</option>
                      <option>PhD / Doctorate</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Willingness to travel <span className={styles.req}>*</span></label>
                    <select value={travelWillingness} onChange={e => setTravelWillingness(e.target.value)}>
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
                      value={currentSalary}
                      onChange={e => setCurrentSalary(e.target.value)}
                      placeholder="e.g. AED 8,000 or INR 50,000"
                    />
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Expected monthly salary <span className={styles.req}>*</span></label>
                    <input
                      value={expectedSalary}
                      onChange={e => setExpectedSalary(e.target.value)}
                      placeholder="e.g. AED 12,000 or INR 80,000"
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>How soon can you join? <span className={styles.req}>*</span></label>
                  <select value={noticePeriod} onChange={e => setNoticePeriod(e.target.value)}>
                    <option value="">Select</option>
                    <option>Immediately</option>
                    <option>2 weeks</option>
                    <option>1 month</option>
                    <option>2 months</option>
                    <option>3 months</option>
                    <option>More than 3 months</option>
                  </select>
                </div>
              </>
            )}

            {/* ── STEP: UAE ── */}
            {currentKey === 'uae' && (
              <>
                <div className={styles.sectionHeading}>
                  UAE details
                  <span className={styles.sectionBadge}>Dubai role</span>
                </div>

                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.label}>Are you currently based in the UAE? <span className={styles.req}>*</span></label>
                    <select value={basedInUAE} onChange={e => setBasedInUAE(e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.label}>Do you have a valid UAE Driving License? <span className={styles.req}>*</span></label>
                    <select value={uaeDrivingLicense} onChange={e => setUaeDrivingLicense(e.target.value)}>
                      <option value="">Select</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Emirate <span className={styles.req}>*</span></label>
                  <select value={emirate} onChange={e => setEmirate(e.target.value)}>
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

            {/* ── STEP: QUESTIONS ── */}
            {currentKey === 'questions' && (
              <>
                <div className={styles.sectionHeading}>Screening questions</div>

                {questionnaire.map((q: any) => (
                  <div key={q.id} className={styles.field}>
                    <label className={styles.label}>
                      {q.text}
                      {q.required && <span className={styles.req}> *</span>}
                    </label>

                    {q.type === 'text' && (
                      <textarea
                        rows={3}
                        value={answers[q.id]?.textAnswer ?? ''}
                        onChange={(e) => setTextAnswer(q.id, e.target.value)}
                        placeholder="Your answer…"
                        className={styles.textarea}
                      />
                    )}

                    {q.type === 'single' && (
                      <div className={styles.optionGroup}>
                        {q.options?.map((opt: any) => (
                          <label key={opt.id} className={styles.optionLabel}>
                            <input
                              type="radio"
                              name={`q_${q.id}`}
                              checked={(answers[q.id]?.selectedOptionIds ?? [])[0] === opt.id}
                              onChange={() => setSingleOption(q.id, opt.id)}
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.type === 'multiple' && (
                      <div className={styles.optionGroup}>
                        {q.options?.map((opt: any) => (
                          <label key={opt.id} className={styles.optionLabel}>
                            <input
                              type="checkbox"
                              checked={(answers[q.id]?.selectedOptionIds ?? []).includes(opt.id)}
                              onChange={() => toggleMultiOption(q.id, opt.id)}
                            />
                            <span>{opt.text}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {/* ── STEP: REVIEW ── */}
            {currentKey === 'review' && (
              <>
                <div className={styles.sectionHeading}>Cover letter & submit</div>

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

                <div className={styles.reviewBox}>
                  <p className={styles.reviewTitle}>Quick summary</p>
                  <ul className={styles.reviewList}>
                    <li><strong>Location:</strong> {location || '—'}</li>
                    <li><strong>Experience:</strong> {experience || '—'}</li>
                    <li><strong>Education:</strong> {education || '—'}</li>
                    <li><strong>Notice:</strong> {noticePeriod || '—'}</li>
                    {isDubai && <li><strong>Emirate:</strong> {emirate || '—'}</li>}
                    {questionnaire.length > 0 && (
                      <li><strong>Screening answers:</strong> {questionnaire.length} question{questionnaire.length !== 1 ? 's' : ''}</li>
                    )}
                  </ul>
                </div>
              </>
            )}

            {error && <p className={styles.error}>{error}</p>}
            {saveMsg && <p className={styles.saveMsg}>{saveMsg}</p>}

            <div className={styles.stepActions}>
              {step > 0 ? (
                <button type="button" className="btn-ghost" onClick={goBack}>
                  Back
                </button>
              ) : (
                <span />
              )}

              <div className={styles.stepActionsRight}>
                <button type="button" className="btn-ghost" onClick={handleSaveForLater}>
                  Save for later
                </button>

                {currentKey !== 'review' ? (
                  <button
                    type="button"
                    className={`btn-primary ${styles.submitBtn}`}
                    onClick={goNext}
                    disabled={currentKey === 'profile' && !profile?.resumeUrl}
                  >
                    Save & continue
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ) : (
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
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
