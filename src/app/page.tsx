'use client'

import { useEffect, useState, useMemo } from 'react'
import JobCard from '@/components/JobCard'
import styles from './page.module.css'

const JOB_TYPES = ['Full-time', 'Part-time', 'Contract', 'Internship']
const PAGE_SIZE = 5

export default function JobsPage() {
  const [jobs, setJobs]         = useState<any[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [dept, setDept]         = useState('All')
  const [type, setType]         = useState('All')
  const [remoteOnly, setRemote] = useState(false)
  const [location, setLocation] = useState('All')
  const [page, setPage]         = useState(1)

  useEffect(() => {
    fetch('/api/jobs')
      .then(r => r.json())
      .then(data => { setJobs(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const departments = Array.from(new Set(jobs.map((j: any) => j.department)))

  const filtered = useMemo(() => {
    return jobs.filter(job => {
      if (search && !job.title.toLowerCase().includes(search.toLowerCase()) &&
          !job.department.toLowerCase().includes(search.toLowerCase())) return false
      if (dept !== 'All' && job.department !== dept) return false
      if (type !== 'All' && job.type !== type) return false
      if (remoteOnly && !job.remote) return false
      if (location !== 'All' && !job.remote && job.location !== location) return false
      return true
    })
  }, [jobs, search, dept, type, location, remoteOnly])

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1) }, [search, dept, type, location, remoteOnly])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const cardStyle  = (i: number) => ({ animationDelay: `${i * 60}ms` } as React.CSSProperties)

  return (
    <div className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroGlow} aria-hidden="true" />

        <div className="container">
          <div className={styles.heroPill}>
            <span className={styles.heroPillDot} />
            {loading ? '—' : `${jobs.length} open positions`}
          </div>
          <h1 className={styles.heroHeading}>
            Build something<br />
            <span className={styles.heroAccent}>worth remembering.</span>
          </h1>
          <p className={styles.heroSub}>
            Join the Rookie Ninja team — a small, focused group building tools
            that developers actually love. Remote-friendly, equity included.
          </p>
          <div className={styles.searchWrap}>
            <div className={styles.searchIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search roles, departments…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
      </section>

      <section className={styles.body}>
        <div className="container">
          <div className={styles.layout}>
            <aside className={styles.sidebar}>
              <div className={styles.filterSection}>
                <p className={styles.filterLabel}>Department</p>
                {['All', ...departments].map(d => (
                  <button
                    key={d}
                    className={`${styles.filterBtn} ${dept === d ? styles.filterActive : ''}`}
                    onClick={() => setDept(d)}
                  >
                    {d}
                    {d !== 'All' && (
                      <span className={styles.filterCount}>
                        {jobs.filter(j => j.department === d).length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className={styles.filterSection}>
                <p className={styles.filterLabel}>Job type</p>
                {['All', ...JOB_TYPES].map(t => (
                  <button
                    key={t}
                    className={`${styles.filterBtn} ${type === t ? styles.filterActive : ''}`}
                    onClick={() => setType(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className={styles.filterSection}>
                <p className={styles.filterLabel}>Location</p>
                {['All', 'Dubai', 'India'].map(l => (
                  <button
                    key={l}
                    className={`${styles.filterBtn} ${location === l ? styles.filterActive : ''}`}
                    onClick={() => setLocation(l)}
                  >
                    {l}
                  </button>
                ))}
              </div>

              <div className={styles.filterSection}>
                <p className={styles.filterLabel}>Work type</p>
                <label className={styles.toggleRow}>
                  <input
                    type="checkbox"
                    checked={remoteOnly}
                    onChange={e => setRemote(e.target.checked)}
                    className={styles.toggleInput}
                  />
                  <span className={styles.toggle} />
                  Remote only
                </label>
              </div>
            </aside>

            <div className={styles.main}>
              <div className={styles.resultsBar}>
                <span className={styles.resultsCount}>
                  {loading ? (
                    <span className={styles.skeletonText} />
                  ) : (
                    <><strong>{filtered.length}</strong> {filtered.length === 1 ? 'role' : 'roles'} found</>
                  )}
                </span>
                {!loading && (search || dept !== 'All' || type !== 'All' || location !== 'All' || remoteOnly) && (
                  <button
                    className={styles.clearBtn}
                    onClick={() => { setSearch(''); setDept('All'); setType('All'); setLocation('All'); setRemote(false) }}
                  >
                    Clear filters
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                )}
              </div>

              {loading ? (
                <div className={styles.grid}>
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={styles.skeletonCard} />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className={styles.empty}>
                  <div className={styles.emptyIcon}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                    </svg>
                  </div>
                  <p className={styles.emptyTitle}>No roles match</p>
                  <p className={styles.emptySub}>Try adjusting your filters or search term.</p>
                </div>
              ) : (
                <>
                  <div className={styles.grid}>
                    {paginated.map((job, i) => (
                      <div key={job._id} style={cardStyle(i)}>
                        <JobCard
                          {...job}
                          postedAt={job.createdAt}
                          isNew={Date.now() - new Date(job.createdAt).getTime() < 3 * 86400000}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className={styles.pagination}>
                      <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 18l-6-6 6-6"/>
                        </svg>
                        Prev
                      </button>

                      <div className={styles.pageNumbers}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                          <button
                            key={p}
                            className={`${styles.pageNum} ${page === p ? styles.pageNumActive : ''}`}
                            onClick={() => setPage(p)}
                          >
                            {p}
                          </button>
                        ))}
                      </div>

                      <button
                        className={styles.pageBtn}
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 18l6-6-6-6"/>
                        </svg>
                      </button>

                      <span className={styles.pageInfo}>
                        Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaInner}>
            <div>
              <h2 className={styles.ctaHeading}>Don't see the right role?</h2>
              <p className={styles.ctaSub}>Send us your profile — we keep great candidates on file.</p>
            </div>
            <a href="mailto:careers@rookie-ninja.com" className="btn-primary">
              Get in touch
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}