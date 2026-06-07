'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend,
} from 'recharts'
import styles from './hr.module.css'

const STATUS_COLORS = {
  pending:     '#4A5A6E',
  shortlisted: '#15A7DC',
  hired:       '#34D399',
  rejected:    '#FBBF24',
}

const CHART_COLORS = ['#15A7DC', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#FB923C']


function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
      color: 'var(--text-primary)',
    }}>
      {label && <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>}
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color ?? 'var(--accent)' }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function HROverview() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [jobs, setJobs]   = useState<any[]>([])
  const [apps, setApps]   = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'hr') {
      router.push('/')
    }
  }, [status, session])

  useEffect(() => {
    Promise.all([
      fetch('/api/jobs?status=all').then(r => r.json()),
      fetch('/api/applications').then(r => r.json()),
    ]).then(([j, a]) => {
      setJobs(Array.isArray(j) ? j : [])
      setApps(Array.isArray(a) ? a : [])
      setLoading(false)
    })
  }, [])

  if (status === 'loading' || !session) return (
    <div style={{ padding: 80, textAlign: 'center', color: 'var(--text-muted)' }}>Loading…</div>
  )


  // ── Stat cards ──
  const stats = [
    { label: 'Open roles',       value: jobs.filter(j => j.status === 'open').length,       color: 'tag-green'  },
    { label: 'Total applicants', value: apps.length,                                         color: 'tag-accent' },
    { label: 'Shortlisted',      value: apps.filter(a => a.status === 'shortlisted').length, color: 'tag-accent' },
    { label: 'Hired',            value: apps.filter(a => a.status === 'hired').length,       color: 'tag-green'  },
  ]

  // ── Status breakdown (pie) ──
  const statusData = Object.entries(STATUS_COLORS).map(([status, color]) => ({
    name:  status.charAt(0).toUpperCase() + status.slice(1),
    value: apps.filter(a => a.status === status).length,
    color,
  })).filter(d => d.value > 0)

  // ── Applications per job (bar) ──
  const appsPerJob = jobs
    .map(job => ({
      name:  job.title.length > 20 ? job.title.slice(0, 20) + '…' : job.title,
      count: apps.filter(a => a.job?._id === job._id || a.job === job._id).length,
    }))
    .filter(d => d.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // ── Applications over time (line) ──
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (13 - i))
    return d.toISOString().split('T')[0]
  })

  const appsOverTime = last14Days.map(date => ({
    date: new Date(date).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' }),
    applications: apps.filter(a => {
      const appDate = new Date(a.createdAt).toISOString().split('T')[0]
      return appDate === date
    }).length,
  }))

  // ── Department breakdown (bar) ──
  const deptMap: Record<string, number> = {}
  apps.forEach(a => {
    const dept = a.job?.department ?? 'Unknown'
    deptMap[dept] = (deptMap[dept] ?? 0) + 1
  })
  const deptData = Object.entries(deptMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)

  // ── Hiring funnel ──
  const funnelData = [
    { stage: 'Applied',     count: apps.length },
    { stage: 'Shortlisted', count: apps.filter(a => ['shortlisted', 'hired'].includes(a.status)).length },
    { stage: 'Hired',       count: apps.filter(a => a.status === 'hired').length },
  ]

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>HR Dashboard</h1>
            <p className={styles.sub}>Analytics and overview of all roles and applications</p>
          </div>
          <Link href="/dashboard/hr/jobs/new" className="btn-primary">
            + Post new job
          </Link>
        </div>

        {/* Stat cards */}
        <div className={styles.stats}>
          {stats.map(s => (
            <div key={s.label} className={styles.statCard}>
              <span className={`tag ${s.color}`}>{s.label}</span>
              <p className={styles.statNum}>{loading ? '—' : s.value}</p>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
            Loading analytics…
          </div>
        ) : apps.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No application data yet. Analytics will appear once candidates start applying.</p>
            <Link href="/dashboard/hr/jobs" className="btn-primary" style={{ marginTop: 16 }}>
              Manage jobs →
            </Link>
          </div>
        ) : (
          <>
            {/* Row 1 — Line chart + Pie chart */}
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Applications over time</h2>
                <p className={styles.chartSub}>Last 14 days</p>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={appsOverTime} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="applications"
                      stroke="#15A7DC"
                      strokeWidth={2}
                      dot={{ fill: '#15A7DC', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Status breakdown</h2>
                <p className={styles.chartSub}>All applications</p>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {statusData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      formatter={(value) => (
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2 — Bar charts */}
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Applications per job</h2>
                <p className={styles.chartSub}>Top roles by applicant count</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={appsPerJob} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Applicants" radius={[4, 4, 0, 0]}>
                      {appsPerJob.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Applications by department</h2>
                <p className={styles.chartSub}>Which departments get most interest</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={deptData} layout="vertical" margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Applicants" radius={[0, 4, 4, 0]}>
                      {deptData.map((_, i) => (
                        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3 — Hiring funnel + Quick links */}
            <div className={styles.chartRow}>
              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Hiring funnel</h2>
                <p className={styles.chartSub}>Applied → Shortlisted → Hired conversion</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={funnelData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Candidates" radius={[4, 4, 0, 0]}>
                      <Cell fill="#15A7DC" />
                      <Cell fill="#34D399" />
                      <Cell fill="#A78BFA" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className={styles.chartCard}>
                <h2 className={styles.chartTitle}>Quick actions</h2>
                <p className={styles.chartSub}>Common HR tasks</p>
                <div className={styles.quickLinks}>
                  <Link href="/dashboard/hr/jobs" className={styles.quickCard}>
                    <div className={styles.quickIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                      </svg>
                    </div>
                    <div>
                      <p className={styles.quickTitle}>Manage Jobs</p>
                      <p className={styles.quickSub}>Post, edit, or close roles</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link href="/dashboard/hr/applications" className={styles.quickCard}>
                    <div className={styles.quickIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <div>
                      <p className={styles.quickTitle}>View Applicants</p>
                      <p className={styles.quickSub}>Review, shortlist, and hire</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                  <Link href="/dashboard/hr/settings" className={styles.quickCard}>
                    <div className={styles.quickIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className={styles.quickTitle}>Settings</p>
                      <p className={styles.quickSub}>Update account details</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}