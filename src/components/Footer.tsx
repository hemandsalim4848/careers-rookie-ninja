import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>RN</div>
          <p className={styles.tagline}>
            Build the future with Rookie Ninja.
          </p>
        </div>
        <div className={styles.links}>
          <div className={styles.linkGroup}>
            <span className={styles.groupLabel}>Company</span>
            <Link href="https://rookie-ninja.com" target="_blank">About</Link>
            <Link href="/">Open roles</Link>
          </div>
          <div className={styles.linkGroup}>
            <span className={styles.groupLabel}>Candidates</span>
            <Link href="/auth/register">Create account</Link>
            <Link href="/auth/login">Sign in</Link>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Rookie Ninja. All rights reserved.</span>
        <span className={styles.accent}>careers.rookie-ninja.com</span>
      </div>
    </footer>
  )
}
