'use client'

import { useCallback, useEffect, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import styles from './ResumeViewerModal.module.css'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

type Props = {
  applicationId: string
  applicantName?: string
  onClose: () => void
}

export default function ResumeViewerModal({
  applicationId,
  applicantName,
  onClose,
}: Props) {
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const fileUrl = `/api/applications/${applicationId}/resume`

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') setPageNumber((p) => Math.max(1, p - 1))
      if (e.key === 'ArrowRight')
        setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, numPages])

  const onLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
    setPageNumber(1)
    setError(null)
  }, [])

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Resume viewer"
      >
        <header className={styles.header}>
          <div className={styles.titleBlock}>
            <p className={styles.title}>Resume</p>
            {applicantName && (
              <p className={styles.subtitle}>{applicantName}</p>
            )}
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={() => setScale((s) => Math.max(0.5, +(s - 0.1).toFixed(1)))}
              aria-label="Zoom out"
            >
              −
            </button>
            <span className={styles.ctrlLabel}>{Math.round(scale * 100)}%</span>
            <button
              type="button"
              className={styles.ctrlBtn}
              onClick={() => setScale((s) => Math.min(2.5, +(s + 0.1).toFixed(1)))}
              aria-label="Zoom in"
            >
              +
            </button>
            <span className={styles.divider} />
            <button
              type="button"
              className={styles.ctrlBtn}
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
              aria-label="Previous page"
            >
              ‹
            </button>
            <span className={styles.ctrlLabel}>
              {numPages ? `${pageNumber} / ${numPages}` : '—'}
            </span>
            <button
              type="button"
              className={styles.ctrlBtn}
              disabled={!numPages || pageNumber >= numPages}
              onClick={() =>
                setPageNumber((p) => (numPages ? Math.min(numPages, p + 1) : p))
              }
              aria-label="Next page"
            >
              ›
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </header>

        <div className={styles.body}>
          {error ? (
            <p className={styles.error}>{error}</p>
          ) : (
            <Document
              file={fileUrl}
              onLoadSuccess={onLoadSuccess}
              onLoadError={() => setError('Could not load this resume.')}
              loading={<p className={styles.loading}>Loading resume…</p>}
              error={<p className={styles.error}>Could not load this resume.</p>}
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderAnnotationLayer={false}
                renderTextLayer={true}
                loading={<p className={styles.loading}>Rendering page…</p>}
              />
            </Document>
          )}
        </div>
      </div>
    </div>
  )
}
