/*
 * Public property submissions.
 *
 * Clients have no Sanity account, so the browser cannot write directly. This
 * runs server-side, where the write token lives, and creates the document as
 * a DRAFT: nothing a stranger types reaches the site until it is published
 * from /manage. The token is never sent to the browser.
 *
 * Deploy target: Vercel (Node runtime). Netlify Functions work the same with
 * a thin wrapper around the handler.
 */

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const DATASET = process.env.SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN
const API = '2024-10-01'

const TAGS = ['Acquisition', 'Disposition', 'Development', 'Advisory', 'Rental']
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

const clean = (v, max) => String(v ?? '').trim().slice(0, max)

/* Crude per-instance throttle. Not a substitute for a real WAF, but it stops
   a single client hammering the endpoint by accident. */
const hits = new Map()
function throttled(ip) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 500) hits.clear()
  return recent.length > 5
}

async function uploadImage(dataUrl) {
  const match = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl || '')
  if (!match) return null

  const [, mime, b64] = match
  if (!OK_TYPES.includes(mime)) throw new Error('Unsupported image type')

  const bytes = Buffer.from(b64, 'base64')
  if (bytes.length > MAX_IMAGE_BYTES) throw new Error('Image too large')

  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v${API}/assets/images/${DATASET}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': mime },
      body: bytes,
    },
  )
  if (!res.ok) throw new Error(`Asset upload failed: ${res.status}`)
  const { document } = await res.json()
  return document._id
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!PROJECT_ID || !TOKEN) {
    return res.status(503).json({ error: 'Submissions are not configured yet.' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (throttled(ip)) {
    return res.status(429).json({ error: 'Too many submissions. Try again in a minute.' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

    // Honeypot: real people leave this hidden field empty.
    if (clean(body.website, 200)) return res.status(200).json({ ok: true })

    const name = clean(body.name, 120)
    const contactEmail = clean(body.contactEmail, 160)
    if (!name) return res.status(400).json({ error: 'Property name is required.' })
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contactEmail)) {
      return res.status(400).json({ error: 'A valid email is required.' })
    }

    const tag = TAGS.includes(body.tag) ? body.tag : 'Acquisition'
    const meta = Array.isArray(body.meta)
      ? body.meta
          .map((m) => ({
            _key: Math.random().toString(36).slice(2, 10),
            label: clean(m?.label, 40),
            value: clean(m?.value, 40),
          }))
          .filter((m) => m.label && m.value)
          .slice(0, 3)
      : []

    let photo
    const assetId = await uploadImage(body.photo)
    if (assetId) photo = { _type: 'image', asset: { _type: 'reference', _ref: assetId } }

    const doc = {
      // The drafts. prefix keeps it unpublished and out of the public board.
      _id: `drafts.submission-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      _type: 'property',
      name,
      tag,
      size: '',
      meta,
      ...(photo ? { photo } : {}),
      submittedBy: clean(body.contactName, 120) || undefined,
      contactEmail,
      contactPhone: clean(body.contactPhone, 40) || undefined,
      notes: clean(body.notes, 2000) || undefined,
      submittedAt: new Date().toISOString(),
    }

    const mutate = await fetch(
      `https://${PROJECT_ID}.api.sanity.io/v${API}/data/mutate/${DATASET}`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ mutations: [{ create: doc }] }),
      },
    )
    if (!mutate.ok) throw new Error(`Mutation failed: ${mutate.status} ${await mutate.text()}`)

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('Property submission failed', err)
    return res.status(500).json({ error: 'Could not submit right now. Please try again.' })
  }
}
