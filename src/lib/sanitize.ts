import DOMPurify from 'isomorphic-dompurify'

export function sanitizeText(input: string): string {
  if (!input) return ''
  // Strip all HTML tags and dangerous content
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }).trim()
}

export function sanitizeRichText(input: string): string {
  if (!input) return ''
  // Allow basic formatting tags only
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
  }).trim()
}