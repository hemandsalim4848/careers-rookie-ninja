'use client'

import { useState } from 'react'
import styles from './ResumeSetupModal.module.css'

interface Props {
  onComplete: (url: string) => void
  onSkip: () => void
}

export default function ResumeSetupModal({ onComplete, onSkip }: Props) {
  const [file, setFile]         = useState<File | null>(null)
  const [linkedIn, setLinkedIn] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) { setError('Please upload your resume.'); return }
    setLoading(true)
    setError('')

    try {
      // 1. Upload resume
      const fd = new FormData()
      fd.append('file', file)
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) throw new Error(uploadData.error)

      // 2. Save LinkedIn + resumeUrl to profile
      const profileRes = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          linkedIn:  linkedIn || undefined,
          resumeUrl: uploadData.url,
        }),
      })

      const profileData = await profileRes.json()
      if (!profileRes.ok) throw new Error(profileData.error)

      onComplete(uploadData.url)
    } catch (err: any) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.iconWrap}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
          </div>
          <h2 className={styles.title}>Complete your profile</h2>
          <p className={styles.sub}>Upload your resume once — it'll be used for all your applications.</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Resume upload */}
          <div className={styles.field}>
            <label className={styles.label}>Resume / CV <span className={styles.req}>*</span></label>
            <div
              className={`${styles.dropzone} ${file ? styles.dropzoneActive : ''}`}
              onClick={() => document.getElementById('modal-resume')?.click()}
            >
              <input
                id="modal-resume"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={e => setFile(e.target.files?.[0] ?? null)}
              />
              {file ? (
                <div className={styles.fileRow}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={e => { e.stopPropagation(); setFile(null) }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <p className={styles.dropText}>Click to upload</p>
                  <p className={styles.dropHint}>PDF, DOC, DOCX — max 5MB</p>
                </>
              )}
            </div>
          </div>

          {/* LinkedIn */}
          <div className={styles.field}>
            <label className={styles.label}>LinkedIn / Portfolio URL (Optional)</label>
            <input
              type="url"
              value={linkedIn}
              onChange={e => setLinkedIn(e.target.value)}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button type="button" className="btn-ghost" onClick={onSkip}>
              Skip for now
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving…' : 'Save & continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}