'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import styles from './settings.module.css'

export default function HRSettingsPage() {
  const { data: session } = useSession()

  const [name, setName]               = useState(session?.user?.name ?? '')
  const [email, setEmail]             = useState(session?.user?.email ?? '')
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirm] = useState('')

  const [profileLoading, setProfileLoading] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError]     = useState('')

  const [passLoading, setPassLoading] = useState(false)
  const [passSuccess, setPassSuccess] = useState('')
  const [passError, setPassError]     = useState('')

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileError('')
    setProfileSuccess('')

    const res = await fetch('/api/hr/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    })

    const data = await res.json()
    setProfileLoading(false)

    if (!res.ok) {
      setProfileError(data.error || 'Failed to update profile.')
    } else {
      setProfileSuccess('Profile updated. Please sign in again for changes to take effect.')
    }
  }

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault()
    setPassLoading(true)
    setPassError('')
    setPassSuccess('')

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.')
      setPassLoading(false)
      return
    }

    if (newPassword.length < 8) {
      setPassError('Password must be at least 8 characters.')
      setPassLoading(false)
      return
    }

    const res = await fetch('/api/hr/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await res.json()
    setPassLoading(false)

    if (!res.ok) {
      setPassError(data.error || 'Failed to update password.')
    } else {
      setPassSuccess('Password updated successfully. Please sign in again.')
      setCurrent('')
      setNewPassword('')
      setConfirm('')
      // Sign out after password change
      setTimeout(() => signOut({ callbackUrl: '/auth/login' }), 2000)
    }
  }

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Account Settings</h1>
            <p className={styles.sub}>Manage your HR account details</p>
          </div>
          <Link href="/dashboard/hr" className="btn-ghost">← Back to dashboard</Link>
        </div>

        <div className={styles.grid}>
          {/* Profile card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Profile information</h2>
            <p className={styles.cardSub}>Update your name and email address</p>

            <form onSubmit={handleProfileUpdate} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>

              {profileError   && <p className={styles.error}>{profileError}</p>}
              {profileSuccess && <p className={styles.success}>{profileSuccess}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={profileLoading}
              >
                {profileLoading ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>

          {/* Password card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Change password</h2>
            <p className={styles.cardSub}>You'll be signed out after changing your password</p>

            <form onSubmit={handlePasswordUpdate} className={styles.form}>
              <div className={styles.field}>
                <label className={styles.label}>Current password</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={e => setCurrent(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>New password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Confirm new password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              {passError   && <p className={styles.error}>{passError}</p>}
              {passSuccess && <p className={styles.success}>{passSuccess}</p>}

              <button
                type="submit"
                className="btn-primary"
                disabled={passLoading}
              >
                {passLoading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}