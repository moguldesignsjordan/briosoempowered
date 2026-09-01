import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'
const apiVersion = '2024-10-01'

/* Nothing is configured until the project id lands in .env. Everything below
   degrades gracefully so the site still builds and renders without a backend. */
export const sanityReady = Boolean(projectId)

/* Reads go over plain fetch against the public CDN endpoint rather than
   @sanity/client, which would put ~80kB of write/listen machinery in the
   visitor bundle for what is one GET. The Studio at /manage still uses the
   full client, but that chunk only loads for whoever is signing in. */
export async function query(groq, params = {}) {
  if (!sanityReady) return []
  const url = new URL(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}`)
  url.searchParams.set('query', groq)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(`$${k}`, JSON.stringify(v))
  }

  const res = await fetch(url, { headers: { Accept: 'application/json' } })
  if (!res.ok) throw new Error(`Sanity responded ${res.status}`)
  const body = await res.json()
  return body.result ?? []
}

const builder = sanityReady
  ? imageUrlBuilder({ projectId, dataset })
  : null

export function imageUrl(source, width = 1200) {
  if (!builder || !source?.asset) return null
  return builder.image(source).width(width).fit('crop').auto('format').url()
}

export const PROPERTY_QUERY = `*[_type == "property" && !(_id in path("drafts.**"))] | order(coalesce(order, 999) asc, _createdAt desc) {
  _id, name, tag, size, photo,
  "meta": meta[]{ label, value }
}`

export const POST_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, cover, publishedAt, body
}`
