import { useRef, useState } from 'react'

const TAGS = ['Acquisition', 'Disposition', 'Development', 'Advisory', 'Rental']
const EMPTY = {
  name: '',
  tag: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
  website: '', // honeypot
}
const EMPTY_META = [
  { label: 'Value', value: '' },
  { label: 'Market', value: '' },
  { label: '', value: '' },
]

const MAX_BYTES = 8 * 1024 * 1024

/* Downscales in the browser before upload. A phone photo is often 6MB+, and
   the card never renders wider than 1600px. */
function shrink(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read that file'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('That file is not a readable image'))
      img.onload = () => {
        const scale = Math.min(1, 1600 / Math.max(img.width, img.height))
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.86))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function SubmitProperty() {
  const [form, setForm] = useState(EMPTY)
  const [meta, setMeta] = useState(EMPTY_META)
  const [photo, setPhoto] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')
  const fileInput = useRef(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const setMetaAt = (i, key) => (e) =>
    setMeta((rows) => rows.map((r, n) => (n === i ? { ...r, [key]: e.target.value } : r)))

  async function pickPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    if (file.size > MAX_BYTES * 3) {
      setError('That image is very large. Please pick one under 24MB.')
      return
    }
    try {
      setPhoto({ dataUrl: await shrink(file), fileName: file.name })
    } catch (err) {
      setError(err.message)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/submit-property', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          meta: meta.filter((m) => m.label && m.value),
          photo: photo?.dataUrl,
        }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(body.error || 'Something went wrong.')

      setStatus('sent')
      setForm(EMPTY)
      setMeta(EMPTY_META)
      setPhoto(null)
    } catch (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  if (status === 'sent') {
    return (
      <section className="section" id="submit">
        <div className="wrap narrow">
          <div className="form-sent" role="status">
            <b>Submitted.</b>
            <p>
              Thank you. Your property is with our team for review. We will confirm by
              email once it is on the board, usually within one business day.
            </p>
            <button className="btn btn-ghost" type="button" onClick={() => setStatus('idle')}>
              Submit another
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section" id="submit">
      <div className="wrap narrow">
        <div className="section-head">
          <span className="eyebrow center">List With Us</span>
          <h2 className="display h-lg">Submit a property<span className="dot">.</span></h2>
          <div className="rule" />
          <p className="lede center">
            Tell us about the asset. A partner reviews every submission before it goes on
            the board, so nothing publishes until we have spoken.
          </p>
        </div>

        <form className="form form-wide" onSubmit={submit} noValidate={false}>
          <fieldset disabled={status === 'sending'}>
            <legend className="field-group">The property</legend>

            <div className="field">
              <label htmlFor="p-name">Property name or address</label>
              <input
                id="p-name" type="text" required maxLength={120}
                placeholder="e.g. The Ellsworth Residences"
                value={form.name} onChange={set('name')}
              />
            </div>

            <div className="field">
              <label htmlFor="p-tag">Deal type</label>
              <select id="p-tag" required value={form.tag} onChange={set('tag')}>
                <option value="">Choose one</option>
                {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="field">
              <label htmlFor="p-photo">Photo</label>
              <div className="upload">
                {photo ? (
                  <div className="upload-preview">
                    <img src={photo.dataUrl} alt="" />
                    <div>
                      <b>{photo.fileName}</b>
                      <button
                        type="button" className="btn-line"
                        onClick={() => { setPhoto(null); if (fileInput.current) fileInput.current.value = '' }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="upload-drop" htmlFor="p-photo">
                    <span className="upload-plus" aria-hidden="true">+</span>
                    <b>Add a photo</b>
                    <small>JPG, PNG, or WebP. Landscape shots read best.</small>
                  </label>
                )}
                <input
                  id="p-photo" ref={fileInput} type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={pickPhoto} className="sr-only"
                />
              </div>
            </div>

            <div className="field">
              <label>Highlights <span className="opt">up to three</span></label>
              <div className="meta-rows">
                {meta.map((row, i) => (
                  <div className="meta-row" key={i}>
                    <input
                      type="text" maxLength={40} placeholder="Label"
                      aria-label={`Highlight ${i + 1} label`}
                      value={row.label} onChange={setMetaAt(i, 'label')}
                    />
                    <input
                      type="text" maxLength={40} placeholder="Value"
                      aria-label={`Highlight ${i + 1} value`}
                      value={row.value} onChange={setMetaAt(i, 'value')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset disabled={status === 'sending'}>
            <legend className="field-group">You</legend>

            <div className="field">
              <label htmlFor="p-cname">Your name</label>
              <input id="p-cname" type="text" maxLength={120} placeholder="Full name"
                value={form.contactName} onChange={set('contactName')} />
            </div>

            <div className="field">
              <label htmlFor="p-email">Email</label>
              <input id="p-email" type="email" required maxLength={160} placeholder="you@example.com"
                value={form.contactEmail} onChange={set('contactEmail')} />
            </div>

            <div className="field">
              <label htmlFor="p-phone">Phone <span className="opt">optional</span></label>
              <input id="p-phone" type="tel" maxLength={40} placeholder="(555) 555-5555"
                value={form.contactPhone} onChange={set('contactPhone')} />
            </div>

            <div className="field">
              <label htmlFor="p-notes">Anything else <span className="opt">optional</span></label>
              <textarea id="p-notes" maxLength={2000} rows={4}
                placeholder="Timeline, price expectations, condition, whatever matters."
                value={form.notes} onChange={set('notes')} />
            </div>
          </fieldset>

          {/* Bots fill this in. People never see it. */}
          <input
            type="text" tabIndex={-1} autoComplete="off" className="sr-only"
            aria-hidden="true" value={form.website} onChange={set('website')}
          />

          {error && <p className="form-error" role="alert">{error}</p>}

          <button type="submit" className="btn btn-gold" disabled={status === 'sending'}>
            {status === 'sending' ? 'Submitting…' : 'Submit Property'}
          </button>
          <p className="form-note">
            Reviewed before publishing. We never share your contact information.
          </p>
        </form>
      </div>
    </section>
  )
}
