/*
 * Public consultation inquiries (the homepage Contact form).
 *
 * Mirrors submit-property.js: the browser has no Sanity write access, so this
 * runs server-side where the write token lives, and files the inquiry as a
 * DRAFT so it only shows up for staff at /manage. The token is never sent to
 * the browser.
 *
 * Deploy target: Vercel (Node runtime). Requires SANITY_WRITE_TOKEN and
 * SANITY_PROJECT_ID in the project's Environment Variables — never in the repo.
 */

export const config = { maxDuration: 15 }

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID
const DATASET = process.env.SANITY_DATASET || 'production'
const TOKEN = process.env.SANITY_WRITE_TOKEN
const API = '2024-10-01'

const INTERESTS = ['talent', 'realty', 'both', 'other']

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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!PROJECT_ID || !TOKEN) {
    return res.status(503).json({ code: 'unconfigured', error: 'Submissions are not configured yet.' })
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 'unknown'
  if (throttled(ip)) {
    return res.status(429).json({ code: 'throttled', error: 'Too many submissions. Try again in a minute.' })
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

    // Honeypot: real people leave this hidden field empty.
    if (clean(body.website, 200)) return res.status(200).json({ ok: true })

    const name = clean(body.name, 120)
    const email = clean(body.email, 160)
    if (!name) return res.status(400).json({ code: 'noName', error: 'Full name is required.' })
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return res.status(400).json({ code: 'badEmail', error: 'A valid email is required.' })
    }

    const interest = INTERESTS.includes(body.interest) ? body.interest : 'other'

    const doc = {
      _id: `drafts.inquiry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      _type: 'inquiry',
      name,
      email,
      phone: clean(body.phone, 40) || undefined,
      interest,
      message: clean(body.message, 4000) || undefined,
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
    console.error('Contact inquiry failed', err)
    return res.status(500).json({ code: 'failed', error: 'Could not submit right now. Please try again.' })
  }
}
