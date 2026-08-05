export type ResumeType = 'pdf' | 'doc' | 'docx' | 'unknown'

const MIME_BY_TYPE: Record<Exclude<ResumeType, 'unknown'>, string> = {
  pdf:  'application/pdf',
  doc:  'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

export function getResumeTypeFromUrl(url: string | null | undefined): ResumeType {
  if (!url) return 'unknown'
  const path = url.split('?')[0].toLowerCase()
  if (path.endsWith('.pdf'))  return 'pdf'
  if (path.endsWith('.docx')) return 'docx'
  if (path.endsWith('.doc'))  return 'doc'
  return 'unknown'
}

export function getResumeMime(type: ResumeType): string {
  if (type === 'unknown') return 'application/octet-stream'
  return MIME_BY_TYPE[type]
}
