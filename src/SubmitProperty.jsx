import { useRef, useState } from 'react'
import { useLang } from './i18n'

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
function shrink(file, t) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error(t.submit.errRead))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error(t.submit.errImage))
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
  const { t } = useLang()
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
      setError(t.submit.errTooBig)
      return
    }
    try {
      setPhoto({ dataUrl: await shrink(file, t), fileName: file.name })
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
      if (!res.ok) {
        // The API answers with a stable code so the message can be localized here.
        throw new Error(t.submit.errors[body.code] || body.error || t.submit.errGeneric)
      }

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
            <b>{t.submit.sentTitle}</b>
            <p>{t.submit.sentBody}</p>
            <button className="btn btn-ghost" type="button" onClick={() => setStatus('idle')}>
              {t.submit.another}
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
          <span className="eyebrow center">{t.submit.eyebrow}</span>
          <h2 className="display h-lg">{t.submit.title}<span className="dot">.</span></h2>
          <div className="rule" />
          <p className="lede center">{t.submit.lede}</p>
        </div>

        <form className="form form-wide" onSubmit={submit} noValidate={false}>
          <fieldset disabled={status === 'sending'}>
            <legend className="field-group">{t.submit.groupProperty}</legend>

            <div className="field">
              <label htmlFor="p-name">{t.submit.name}</label>
              <input
                id="p-name" type="text" required maxLength={120}
                placeholder={t.submit.namePlaceholder}
                value={form.name} onChange={set('name')}
              />
            </div>

            <div className="field">
              <label htmlFor="p-tag">{t.submit.tag}</label>
              <select id="p-tag" required value={form.tag} onChange={set('tag')}>
                <option value="">{t.submit.tagPlaceholder}</option>
                {TAGS.map((tag) => (
                  <option key={tag} value={tag}>{t.submit.tags[tag]}</option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="p-photo">{t.submit.photo}</label>
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
                        {t.submit.photoRemove}
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="upload-drop" htmlFor="p-photo">
                    <span className="upload-plus" aria-hidden="true">+</span>
                    <b>{t.submit.photoAdd}</b>
                    <small>{t.submit.photoHint}</small>
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
              <label>{t.submit.highlights} <span className="opt">{t.submit.highlightsOpt}</span></label>
              <div className="meta-rows">
                {meta.map((row, i) => (
                  <div className="meta-row" key={i}>
                    <input
                      type="text" maxLength={40} placeholder={t.submit.hLabel}
                      aria-label={t.submit.hAria(i + 1, t.submit.hLabel)}
                      value={row.label} onChange={setMetaAt(i, 'label')}
                    />
                    <input
                      type="text" maxLength={40} placeholder={t.submit.hValue}
                      aria-label={t.submit.hAria(i + 1, t.submit.hValue)}
                      value={row.value} onChange={setMetaAt(i, 'value')}
                    />
                  </div>
                ))}
              </div>
            </div>
          </fieldset>

          <fieldset disabled={status === 'sending'}>
            <legend className="field-group">{t.submit.groupYou}</legend>

            <div className="field">
              <label htmlFor="p-cname">{t.submit.yourName}</label>
              <input id="p-cname" type="text" maxLength={120} placeholder={t.submit.yourNamePlaceholder}
                value={form.contactName} onChange={set('contactName')} />
            </div>

            <div className="field">
              <label htmlFor="p-email">{t.submit.email}</label>
              <input id="p-email" type="email" required maxLength={160} placeholder="you@example.com"
                value={form.contactEmail} onChange={set('contactEmail')} />
            </div>

            <div className="field">
              <label htmlFor="p-phone">{t.submit.phone} <span className="opt">{t.submit.optional}</span></label>
              <input id="p-phone" type="tel" maxLength={40} placeholder="(555) 555-5555"
                value={form.contactPhone} onChange={set('contactPhone')} />
            </div>

            <div className="field">
              <label htmlFor="p-notes">{t.submit.notes} <span className="opt">{t.submit.optional}</span></label>
              <textarea id="p-notes" maxLength={2000} rows={4}
                placeholder={t.submit.notesPlaceholder}
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
            {status === 'sending' ? t.submit.submitting : t.submit.submit}
          </button>
          <p className="form-note">{t.submit.note}</p>
        </form>
      </div>
    </section>
  )
}
