'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '../../../jobs/new/jobform.module.css'

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()

  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError]       = useState('')

  const [form, setForm] = useState({
    title: '', department: '', location: '', type: 'Full-time',
    remote: false, currency: 'AED', salaryMin: '', salaryMax: '',
    description: '', responsibilities: '', requirements: '',targetMarkets: '', niceToHave: '',
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  useEffect(() => {
    fetch(`/api/jobs/${id}`)
      .then(r => r.json())
      .then(job => {
        setForm({
          title:            job.title            ?? '',
          department:       job.department        ?? '',
          location:         job.location          ?? '',
          type:             job.type              ?? 'Full-time',
          remote:           job.remote            ?? false,
          currency:         job.currency          ?? 'AED',
          salaryMin:        job.salaryMin?.toString() ?? '',
          salaryMax:        job.salaryMax?.toString() ?? '',
          description:      job.description       ?? '',
          responsibilities: (job.responsibilities ?? []).join('\n'),
          requirements:     (job.requirements     ?? []).join('\n'),
           targetMarkets:    job.targetMarkets      ?? '',
          niceToHave:       (job.niceToHave       ?? []).join('\n'),
         
        })
        setFetching(false)
      })
      .catch(() => setFetching(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const body = {
      ...form,
      salaryMin:        form.salaryMin ? Number(form.salaryMin) : undefined,
      salaryMax:        form.salaryMax ? Number(form.salaryMax) : undefined,
      responsibilities: form.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
      requirements:     form.requirements.split('\n').map(s => s.trim()).filter(Boolean),
      targetMarkets:    form.targetMarkets || undefined,
      niceToHave:       form.niceToHave.split('\n').map(s => s.trim()).filter(Boolean),
      
    }

    const res = await fetch(`/api/jobs/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    setLoading(false)

    if (res.ok) {
      router.push('/dashboard/hr/jobs')
    } else {
      const data = await res.json()
      setError(data.error || 'Failed to update job.')
    }
  }

  if (fetching) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )

  return (
    <div className={styles.page}>
      <div className="container">
        <Link href="/dashboard/hr/jobs" className={styles.back}>← Back to jobs</Link>
        <div className={styles.card}>
          <h1 className={styles.heading}>Edit job</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Job title *</label>
                <input required value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Senior Frontend Engineer" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Department *</label>
                <input required value={form.department} onChange={e => set('department', e.target.value)} placeholder="e.g. Engineering" />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Location *</label>
                <select required value={form.location} onChange={e => set('location', e.target.value)}>
                  <option value="">Select location</option>
                  <option value="Dubai">Dubai</option>
                  <option value="India">India</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Job type *</label>
                <select value={form.type} onChange={e => set('type', e.target.value)}>
                  {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Currency</label>
                <select value={form.currency} onChange={e => set('currency', e.target.value)}>
                  {['AED', 'INR', 'USD', 'EUR', 'GBP'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Salary min</label>
                <input type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} placeholder="e.g. 1200000" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Salary max</label>
                <input type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} placeholder="e.g. 2000000" />
              </div>
            </div>

            <label className={styles.checkRow}>
              <input type="checkbox" checked={form.remote} onChange={e => set('remote', e.target.checked)} />
              Remote-friendly role
            </label>

            <div className={styles.field}>
              <label className={styles.label}>Job description *</label>
              <textarea required rows={4} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the role and team…" />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Responsibilities * <span className={styles.hint}>(one per line)</span></label>
              <textarea required rows={5} value={form.responsibilities} onChange={e => set('responsibilities', e.target.value)} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Requirements * <span className={styles.hint}>(one per line)</span></label>
              <textarea required rows={5} value={form.requirements} onChange={e => set('requirements', e.target.value)} />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Target markets & industries <span className={styles.hint}>(optional)</span></label>
              <textarea
                rows={5}
                value={form.targetMarkets}
                onChange={e => set('targetMarkets', e.target.value)}
                placeholder="Describe the target markets, regions, and industries relevant to this role…"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Nice to have <span className={styles.hint}>(one per line, optional)</span></label>
              <textarea rows={3} value={form.niceToHave} onChange={e => set('niceToHave', e.target.value)} />
            </div>

            

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.formActions}>
              <Link href="/dashboard/hr/jobs" className="btn-ghost">Cancel</Link>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}