import sanitizeHtml from 'sanitize-html'

// Strips all HTML — use for plain text fields (name, phone, etc.)
export function sanitizeText(input: string): string {
  if (!input) return ''
  return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} }).trim()
}

// Allows a safe subset of HTML — use for rich text fields (job description)
export function sanitizeRichText(input: string): string {
  if (!input) return ''
  return sanitizeHtml(input, {
    allowedTags: ['p', 'br', 'b', 'i', 'em', 'strong', 'ul', 'ol', 'li', 'a', 'h2', 'h3'],
    allowedAttributes: {
      a: ['href', 'target', 'rel'],
    },
    allowedSchemes: ['https', 'mailto'],
    transformTags: {
      a: (_tagName, attribs) => ({
        tagName: 'a',
        attribs: { ...attribs, rel: 'noopener noreferrer' },
      }),
    },
  }).trim()
}