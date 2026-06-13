export function generateSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .replace(/\s+/g, '-')            // spaces to hyphens
    .replace(/-+/g, '-')             // collapse multiple hyphens
    .trim()

  // Append last 8 chars of MongoDB ID for uniqueness
  const shortId = id.toString().slice(-8)
  return `${slug}-${shortId}`
}