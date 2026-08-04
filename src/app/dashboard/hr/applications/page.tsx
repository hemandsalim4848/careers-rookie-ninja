"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./applications.module.css";

const STATUSES = ["pending", "shortlisted", "hired", "rejected"] as const;

const STATUS_CONFIG = {
  pending: { label: "Pending", cls: "tag-gray" },
  shortlisted: { label: "Shortlisted", cls: "tag-accent" },
  hired: { label: "Hired", cls: "tag-green" },
  rejected: { label: "Rejected", cls: "tag-amber" },
};

const PAGE_SIZE = 5;

function Detail({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className={styles.detailItem}>
      <span className={styles.detailLabel}>{label}</span>
      <span className={styles.detailValue}>{value}</span>
    </div>
  );
}

function ApplicationsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") ?? "";
  const [apps, setApps] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState(jobId);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [scoreFilter, setScoreFilter] = useState<"all" | "meets" | "below">("all");

  // Auth guard
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "hr"
    ) {
      router.push("/");
    }
  }, [status, session]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/jobs?status=all")
      .then((r) => r.json())
      .then((data) => setJobs(Array.isArray(data) ? data : []))
      .catch(() => setJobs([]));
  }, [status]);

  useEffect(() => {
    const url = filter
      ? `/api/applications?jobId=${filter}`
      : "/api/applications";
    setLoading(true);
    setPage(1);
    setExpandedId(null);
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        setApps(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setApps([]);
        setLoading(false);
      });
  }, [filter]);

  // Reset page when search or score filter changes
  useEffect(() => {
    setPage(1);
  }, [search, scoreFilter]);

  // Filter by search + score threshold
  const filtered = useMemo(() => {
    let list = apps;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (app) =>
          app.seeker?.name?.toLowerCase().includes(q) ||
          app.seeker?.email?.toLowerCase().includes(q) ||
          app.job?.title?.toLowerCase().includes(q) ||
          app.job?.department?.toLowerCase().includes(q) ||
          app.location?.toLowerCase().includes(q) ||
          app.phone?.toLowerCase().includes(q),
      );
    }

    if (scoreFilter !== "all") {
      list = list.filter((app) => {
        const min = app.job?.minimumScore ?? 0;
        if (min <= 0) return scoreFilter === "meets"; // no threshold → treat as meets
        const score = app.totalScore ?? 0;
        return scoreFilter === "meets" ? score >= min : score < min;
      });
    }

    return list;
  }, [apps, search, scoreFilter]);

  // All hooks above — safe to return early now
  if (status === "loading" || !session)
    return (
      <div
        style={{ padding: 80, textAlign: "center", color: "var(--text-muted)" }}
      >
        Loading…
      </div>
    );

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setApps((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
  }

  async function deleteApplicant(id: string) {
    if (!confirm("Delete this applicant? This cannot be undone.")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    setApps((prev) => prev.filter((a) => a._id !== id));
    if (expandedId === id) setExpandedId(null);
  }

  function exportCSV() {
    const url = filter
      ? `/api/applications/export?jobId=${filter}`
      : "/api/applications/export";
    window.open(url, "_blank");
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <div>
            <h1 className={styles.heading}>Applicants</h1>
            <p className={styles.sub}>
              {filtered.length !== apps.length
                ? `${filtered.length} of ${apps.length} applications`
                : `${apps.length} application${apps.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div className={styles.headerActions}>
            <select
              className={styles.jobFilter}
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setSearch("");
                setScoreFilter("all");
              }}
            >
              <option value="">All jobs</option>
              {jobs?.map((j) => (
                <option key={j._id} value={j._id}>
                  {j.title}
                </option>
              ))}
            </select>
            <select
              className={styles.jobFilter}
              value={scoreFilter}
              onChange={(e) =>
                setScoreFilter(e.target.value as "all" | "meets" | "below")
              }
            >
              <option value="all">All scores</option>
              <option value="meets">Meets minimum</option>
              <option value="below">Below minimum</option>
            </select>
            <button className="btn-ghost" onClick={exportCSV}>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className={styles.searchWrap}>
          <div className={styles.searchIcon}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by name, email, job title, department, location…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          {search && (
            <button
              className={styles.searchClear}
              onClick={() => setSearch("")}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {loading ? (
          <p style={{ color: "var(--text-muted)" }}>Loading…</p>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>
              {search
                ? `No applicants match "${search}"`
                : "No applications yet"}
            </p>
            {search && (
              <button
                className="btn-ghost"
                style={{ marginTop: 12 }}
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className={styles.table}>
              <div className={styles.tableHead}>
                <span>Applicant</span>
                <span>Role</span>
                <span>Applied</span>
                <span>Score</span>
                <span>Resume</span>
                <span>Status</span>
                <span></span>
              </div>

              {paginated?.map((app) => {
                const isExpanded = expandedId === app._id;
                const isUAE = app.job?.location === "Dubai";
                const minScore = app.job?.minimumScore ?? 0;
                const score = app.totalScore ?? 0;
                const hasThreshold = minScore > 0;
                const meetsMin = hasThreshold && score >= minScore;

                return (
                  <div key={app._id}>
                    <div
                      className={`${styles.tableRow} ${isExpanded ? styles.tableRowExpanded : ""}`}
                      onClick={() => setExpandedId(isExpanded ? null : app._id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div>
                        <p className={styles.name}>{app.seeker?.name}</p>
                        <p className={styles.email}>{app.seeker?.email}</p>
                        {app.phone && (
                          <p className={styles.email}>{app.phone}</p>
                        )}
                        {app.linkedIn && (
                          <a
                            href={app.linkedIn}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.linkedIn}
                            onClick={(e) => e.stopPropagation()}
                          >
                            LinkedIn ↗
                          </a>
                        )}
                      </div>
                      <div>
                        <p className={styles.jobTitle}>{app.job?.title}</p>
                        <p className={styles.email}>{app.job?.department}</p>
                      </div>
                      <span className={styles.date}>
                        {new Date(app.createdAt).toLocaleDateString("en-AE", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <div className={styles.scoreCell}>
                        <span className={styles.scoreValue}>{score}</span>
                        {hasThreshold && (
                          <span
                            className={
                              meetsMin ? styles.scorePass : styles.scoreFail
                            }
                          >
                            {meetsMin ? "Meets min" : "Below min"}
                          </span>
                        )}
                      </div>
                      <a
                        href={app.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.resumeLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View ↗
                      </a>
                      <select
                        className={`${styles.statusSelect} ${styles[app.status]}`}
                        value={app.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateStatus(app._id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_CONFIG[s].label}
                          </option>
                        ))}
                      </select>
                      <div
                        className={styles.rowActions}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className={`${styles.expandBtn} ${isExpanded ? styles.expandBtnActive : ""}`}
                          onClick={() =>
                            setExpandedId(isExpanded ? null : app._id)
                          }
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{
                              transform: isExpanded ? "rotate(180deg)" : "none",
                              transition: "transform 0.2s",
                            }}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </svg>
                        </button>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => deleteApplicant(app._id)}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={styles.drawer}>
                        <div className={styles.drawerGrid}>
                          <div className={styles.drawerSection}>
                            <p className={styles.drawerSectionTitle}>
                              Application details
                            </p>
                            <Detail
                              label="Current location"
                              value={app.location}
                            />
                            <Detail label="Experience" value={app.experience} />
                            <Detail label="Education" value={app.education} />
                            <Detail
                              label="Travel willingness"
                              value={app.travelWillingness}
                            />
                            <Detail
                              label="Current salary"
                              value={app.currentSalary}
                            />
                            <Detail
                              label="Expected salary"
                              value={app.expectedSalary}
                            />
                            <Detail
                              label="Notice period"
                              value={app.noticePeriod}
                            />
                            <Detail
                              label="Questionnaire score"
                              value={
                                hasThreshold
                                  ? `${score} / min ${minScore}`
                                  : String(score)
                              }
                            />
                          </div>

                          {isUAE &&
                            (app.basedInUAE ||
                              app.emirate ||
                              app.uaeDrivingLicense) && (
                              <div className={styles.drawerSection}>
                                <p className={styles.drawerSectionTitle}>
                                  UAE details
                                </p>
                                <Detail
                                  label="Based in UAE"
                                  value={app.basedInUAE}
                                />
                                <Detail label="Emirate" value={app.emirate} />
                                <Detail
                                  label="UAE Driving License"
                                  value={app.uaeDrivingLicense}
                                />
                              </div>
                            )}

                          {app.coverLetter && (
                            <div
                              className={`${styles.drawerSection} ${styles.drawerSectionFull}`}
                            >
                              <p className={styles.drawerSectionTitle}>
                                Cover letter
                              </p>
                              <p className={styles.drawerCoverLetter}>
                                {app.coverLetter}
                              </p>
                            </div>
                          )}

                          {(app.job?.questionnaire?.length > 0 ||
                            app.questionnaireAnswers?.length > 0) && (
                            <div
                              className={`${styles.drawerSection} ${styles.drawerSectionFull}`}
                            >
                              <p className={styles.drawerSectionTitle}>
                                Questionnaire answers
                              </p>
                              <div className={styles.qaList}>
                                {(app.job?.questionnaire ?? []).map(
                                  (q: any) => {
                                    const ans = (
                                      app.questionnaireAnswers ?? []
                                    ).find(
                                      (a: any) => a.questionId === q.id,
                                    );
                                    let display = "—";
                                    let points = 0;
                                    if (q.type === "text") {
                                      display = ans?.textAnswer?.trim() || "—";
                                    } else {
                                      const selected =
                                        ans?.selectedOptionIds ?? [];
                                      const opts = (q.options ?? []).filter(
                                        (o: any) => selected.includes(o.id),
                                      );
                                      display =
                                        opts.map((o: any) => o.text).join(", ") ||
                                        "—";
                                      points = opts.reduce(
                                        (s: number, o: any) =>
                                          s + (o.points || 0),
                                        0,
                                      );
                                    }
                                    return (
                                      <div key={q.id} className={styles.qaItem}>
                                        <div className={styles.qaQuestion}>
                                          {q.text}
                                          {q.type !== "text" && (
                                            <span className={styles.qaPoints}>
                                              +{points} pts
                                            </span>
                                          )}
                                        </div>
                                        <div className={styles.qaAnswer}>
                                          {display}
                                        </div>
                                      </div>
                                    );
                                  },
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Prev
                </button>
                <div className={styles.pageNumbers}>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        key={p}
                        className={`${styles.pageNum} ${page === p ? styles.pageNumActive : ""}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ),
                  )}
                </div>
                <button
                  className={styles.pageBtn}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
                <span className={styles.pageInfo}>
                  Showing {(page - 1) * PAGE_SIZE + 1}–
                  {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                  {filtered.length}
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function HRApplicationsPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            padding: 80,
            textAlign: "center",
            color: "var(--text-muted)",
          }}
        >
          Loading…
        </div>
      }
    >
      <ApplicationsContent />
    </Suspense>
  );
}
