import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET || 'production'

/* Nothing is configured until the project id lands in .env. Everything below
   degrades to null so the site still builds and renders without a backend. */
export const sanityReady = Boolean(projectId)

export const sanity = sanityReady
  ? createClient({
      projectId,
      dataset,
      apiVersion: '2024-10-01',
      useCdn: true,
      perspective: 'published',
    })
  : null

const builder = sanity ? imageUrlBuilder(sanity) : null

export function imageUrl(source, width = 1200) {
  if (!builder || !source?.asset) return null
  return builder.image(source).width(width).fit('crop').auto('format').url()
}

export const PROPERTY_QUERY = `*[_type == "property" && !(_id in path("drafts.**"))] | order(coalesce(order, 999) asc, _createdAt desc) {
  _id, name, tag, size, photo, hotspot,
  "meta": meta[]{ label, value }
}`

export const POST_QUERY = `*[_type == "post" && !(_id in path("drafts.**")) && defined(publishedAt)] | order(publishedAt desc) {
  _id, title, "slug": slug.current, excerpt, cover, publishedAt, body
}`
