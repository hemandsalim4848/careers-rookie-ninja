'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isHR = session?.user?.role === 'hr'

  const navLinks = (
    <>
      <Link href="/" className={`${styles.navLink} ${pathname === '/' ? styles.active : ''}`} onClick={() => setOpen(false)}>Jobs</Link>
      {session && !isHR && (
        <Link href="/dashboard/seeker" className={`${styles.navLink} ${pathname.startsWith('/dashboard/seeker') ? styles.active : ''}`} onClick={() => setOpen(false)}>My Applications</Link>
      )}
      {isHR && (
        <>
          <Link href="/dashboard/hr" className={`${styles.navLink} ${pathname === '/dashboard/hr' ? styles.active : ''}`} onClick={() => setOpen(false)}>Dashboard</Link>
          <Link href="/dashboard/hr/jobs" className={`${styles.navLink} ${pathname.startsWith('/dashboard/hr/jobs') ? styles.active : ''}`} onClick={() => setOpen(false)}>Manage Jobs</Link>
          <Link href="/dashboard/hr/applications" className={`${styles.navLink} ${pathname.startsWith('/dashboard/hr/applications') ? styles.active : ''}`} onClick={() => setOpen(false)}>Applicants</Link>
          <Link
  href="/dashboard/hr/settings"
  className={`${styles.navLink} ${pathname.startsWith('/dashboard/hr/settings') ? styles.active : ''}`}
  onClick={() => setOpen(false)}
>
  Settings
</Link>
        </>
      )}
    </>
  )

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>RN</span>
          <span className={styles.logoText}>
            Rookie<span className={styles.logoAccent}>Ninja</span>
            <span className={styles.logoBadge}>Careers</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>{navLinks}</nav>

        {/* Desktop auth */}
        <div className={styles.actions}>
          {session ? (
            <div className={styles.userArea}>
              <span className={styles.userAvatar}>{session.user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
              <span className={styles.userName}>{session.user?.name}</span>
              {isHR && <span className="tag tag-accent">HR</span>}
              <button className="btn-ghost" onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost">Sign in</Link>
              <Link href="/auth/register" className="btn-primary">Join us</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={styles.hamburger}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <nav className={styles.drawerNav}>{navLinks}</nav>
        <div className={styles.drawerActions}>
          {session ? (
            <div className={styles.drawerUserArea}>
              <span className={styles.userAvatar}>{session.user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
              <span className={styles.userName}>{session.user?.name}</span>
              {isHR && <span className="tag tag-accent">HR</span>}
              <button className="btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => { signOut({ callbackUrl: '/' }); setOpen(false) }}>Sign out</button>
            </div>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>Sign in</Link>
              <Link href="/auth/register" className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }} onClick={() => setOpen(false)}>Join us</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}