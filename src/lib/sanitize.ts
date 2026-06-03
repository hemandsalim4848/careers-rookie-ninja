export function sanitizeText(input: string): string {
  if (!input) return ''
  return input
    .replace(/<[^>]*>/g, '')           // strip HTML tags
    .replace(/javascript:/gi, '')       // remove javascript: urls
    .replace(/on\w+\s*=/gi, '')         // remove event handlers (onclick= etc)
    .replace(/[<>]/g, '')               // remove any remaining < >
    .trim()
}

export function sanitizeRichText(input: string): string {
  if (!input) return ''
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // remove script tags
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim()
}