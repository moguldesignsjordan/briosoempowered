import { useCallback, useEffect, useRef, useState } from 'react'
import heroImg from './assets/hero.png'
import mogulLogo from './assets/mogul.png'
import baldoImg from './assets/baldo.jpg'
import { sanity, sanityReady, imageUrl, PROPERTY_QUERY } from './lib/sanity'

/* ------------------------------------------------------------------
   data
   ------------------------------------------------------------------ */

const NAV = [
  ['Divisions', '#divisions'],
  ['Services', '#services'],
  ['Roster', '#roster'],
  ['Portfolio', '#portfolio'],
  ['Process', '#process'],
  ['Contact', '#contact'],
]

const MARQUEE = [
  'Talent Management',
  'Brand Partnerships',
  'Luxury Acquisitions',
  'Portfolio Strategy',
  'Tour & Touring Ops',
  'Investment Advisory',
  'Career Architecture',
  'Off-Market Access',
]

const SERVICES = [
  {
    title: 'Career Architecture',
    copy: 'Positioning, deal flow, and long-horizon planning for creators, artists, and founders who intend to still be relevant in a decade.',
    icon: 'compass',
  },
  {
    title: 'Partnerships & Press',
    copy: 'Endorsements and equity deals that read as choices, not paychecks, plus narrative control across editorial, broadcast, and social.',
    icon: 'mic',
  },
  {
    title: 'Business Build-Out',
    copy: 'From idea to entity. Strategy, pricing, and positioning, then the LLC, EIN, operating agreement, and banking filed clean the first time.',
    icon: 'growth',
  },
  {
    title: 'Credit & Capital',
    copy: 'Repair the profile, restructure the debt, and learn the levers. Credit is the cheapest capital you will ever raise, so we teach you to use it.',
    icon: 'card',
  },
  {
    title: 'Real Estate & Portfolio',
    copy: 'Off-market sourcing, cash-flowing acquisitions, and hold-refinance-exit modeling run against your tax posture and the next ten years.',
    icon: 'key',
  },
  {
    title: 'Ownership & Legacy',
    copy: 'Proven turnkey ventures built end to end, structured into trusts and succession, with the mentorship that keeps the operator sharp.',
    icon: 'shield',
  },
]

const STATS = [
  ['$480M+', 'Transacted Volume'],
  ['120+', 'Clients Represented'],
  ['18', 'Markets Served'],
  ['11', 'Years Operating'],
]

/* The roster is one featured client. To show several again, make this an
   array and swap the .feature layout for a grid. */
const FEATURED = {
  name: 'Baldo Mindset',
  tag: 'Creator & Speaker',
  bio: 'Mindset and self-development content that turned a personal rebuild into an audience. We handle the partnerships, the press, and the long-term plan behind the channel.',
  image: baldoImg,
  alt: 'Baldo Mindset holding his YouTube Silver Creator Award',
  stats: [
    ['100K+', 'Subscribers'],
    ['Silver', 'YouTube Award'],
  ],
}

const PROCESS = [
  ['Phase 01', 'Discovery', 'A closed-door assessment of where you actually stand: income, exposure, leverage, and the reputation you have not yet monetized.'],
  ['Phase 02', 'Blueprint', 'We return a written plan: the deals to chase, the ones to decline, and the structure that holds it all together.'],
  ['Phase 03', 'Execution', 'Negotiation, diligence, and closing run by our desk. You approve; we handle the rest of the room.'],
  ['Phase 04', 'Stewardship', 'Quarterly review against the blueprint, because the plan that worked last year is rarely the one that works next year.'],
]

const QUOTES = [
  {
    text: 'They turned a career into an institution.',
    name: 'Maya Oduya',
    role: 'Recording Artist',
  },
  {
    text: 'The only team that told me which deals to walk away from.',
    name: 'Devon Cole',
    role: 'Professional Athlete',
  },
  {
    text: 'I closed off-market in eleven days. Nothing about it felt rushed.',
    name: 'August Reyes',
    role: 'Founder & Investor',
  },
]

const YEAR = new Date().getFullYear()

/* ------------------------------------------------------------------
   icons
   ------------------------------------------------------------------ */

const PATHS = {
  compass: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm3.6 6.4-2.1 5.1-5.1 2.1 2.1-5.1 5.1-2.1Z',
  handshake: 'M3 11l4-4 4 3 3-3 3 2 4-3v8l-4 4-3-3-3 3-4-3-4 3v-7Z',
  mic: 'M12 3a3 3 0 0 1 3 3v6a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3Zm-7 9a7 7 0 0 0 14 0M12 19v3',
  key: 'M15 3a6 6 0 1 1-5.6 8.2L3 17.6V21h3.4l1.4-1.4v-2h2v-2h2l1-1A6 6 0 0 1 15 3Zm1.5 3.5h.01',
  chart: 'M4 20V10m5 10V4m5 16v-7m5 7V8',
  shield: 'M12 2l8 3.5v6c0 5-3.4 9.2-8 10.5-4.6-1.3-8-5.5-8-10.5v-6L12 2Zm0 6v8',
  growth: 'M3 20h18M6 20V9m0 0 5 4 4-6 4 3M15 4h5v5',
  doc: 'M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M14 3l5 5M14 3v5h5M8 12h5M8 16h3m9-4-4.5 4.5L15 20l3.5-.5L23 15l-3-3Z',
  card: 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Zm0 3h18M6 15h4',
  building: 'M4 21V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v15M14 11h5a1 1 0 0 1 1 1v9M4 21h17M7 8h1m3 0h1M7 12h1m3 0h1M7 16h1m3 0h1m5 0h1',
  moto: 'M5.5 18a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm13 0a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-13-3.5h6l4-5h3M13 6h3l1.5 5.5M9 9.5h4',
  mentor: 'M12 14a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm-6.5 7a6.5 6.5 0 0 1 13 0M12 2v3M5.6 5.6l2.1 2.1m10.7-2.1-2.1 2.1M2.5 11h3m13 0h3',
}

function Icon({ name, className = 'service-icon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  )
}

const SOCIALS = [
  ['Instagram', 'https://www.instagram.com/brioso_empowered.llc', 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9ZM17.8 6.2h.01'],
  ['LinkedIn', 'https://linkedin.com', 'M4 9v11M4 4.5v.01M9.5 20V9m0 4.5c0-2.5 1.6-4 3.8-4S18 11 18 13.8V20'],
  ['X', 'https://x.com', 'M3 3l8 10.5L3.6 21M20.4 3l-7.6 8M21 21l-8.4-11'],
]

/* ------------------------------------------------------------------
   reveal on scroll
   ------------------------------------------------------------------ */

function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

function Reveal({ as: Tag = 'div', delay = 0, from = '', className = '', children, ...rest }) {
  return (
    <Tag
      className={`reveal ${from ? `rv-${from}` : ''} ${className}`.replace(/\s+/g, ' ').trim()}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  )
}

/* Thin scroll-progress bar. Reads well on phones where the nav is collapsed. */
function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    let frame = 0
    const paint = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const pct = max > 0 ? Math.min(1, window.scrollY / max) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${pct})`
    }
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint) }
    paint()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return <div className="progress" aria-hidden="true"><i ref={bar} /></div>
}

const REDUCED = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* Counts a stat up once it scrolls into view. Keeps the prefix/suffix intact. */
function CountUp({ value }) {
  const el = useRef(null)

  useEffect(() => {
    const node = el.current
    const match = /^(\D*)([\d.]+)(.*)$/.exec(value)
    if (!node || !match || REDUCED() || !('IntersectionObserver' in window)) return

    const [, prefix, digits, suffix] = match
    const target = parseFloat(digits)
    const decimals = (digits.split('.')[1] || '').length
    let frame = 0

    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1100)
        const eased = 1 - Math.pow(1 - t, 3)
        node.textContent = prefix + (target * eased).toFixed(decimals) + suffix
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      node.textContent = prefix + (0).toFixed(decimals) + suffix
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.5 })

    io.observe(node)
    return () => { io.disconnect(); if (frame) cancelAnimationFrame(frame) }
  }, [value])

  return <b ref={el}>{value}</b>
}

const Arrow = () => (
  <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor"
    strokeWidth="1.4" aria-hidden="true">
    <path d="M0 5h12M8.5 1.2 12.4 5 8.5 8.8" />
  </svg>
)

/* ------------------------------------------------------------------
   sections
   ------------------------------------------------------------------ */

function Nav() {
  const [stuck, setStuck] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <header className={`nav ${stuck ? 'stuck' : ''}`}>
        <div className="nav-inner wrap">
          <a className="logo" href="#top" aria-label="Brioso Empowered, home">
            <span className="logo-word">
              <b>BRIOSO</b>
              <small>Empowered LLC</small>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV.map(([label, href]) => (
              <a key={href} href={href}>{label}</a>
            ))}
          </nav>

          <a className="btn btn-gold" href="#contact">
            Book a Consult <Arrow />
          </a>

          <button
            type="button"
            className={`burger ${open ? 'open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <i /><i /><i />
          </button>
        </div>
      </header>

      <div className={`drawer ${open ? 'open' : ''}`} aria-hidden={!open}>
        {NAV.map(([label, href]) => (
          <a key={href} href={href} tabIndex={open ? 0 : -1} onClick={() => setOpen(false)}>
            {label}
          </a>
        ))}
      </div>
    </>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" aria-hidden="true">
        <div className="city" />
        <div
          className="skyline"
          style={{
            backgroundImage: `url(${heroImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="veil" />
      </div>
      <div className="grain" aria-hidden="true" />

      <div className="hero-inner">
        <Reveal as="span" className="eyebrow">Talent × Real Estate</Reveal>

        <Reveal as="h1" className="display h-xl" delay={90}>
          We build careers,<br />portfolios &amp; <em>legacies</em><span className="dot">.</span>
        </Reveal>

        <Reveal as="p" className="lede" delay={180} from="blur">
          We rep creators, artists, and founders, plus the realtors and properties
          that turn a hot run into permanent money. One desk. Two disciplines.
          Zero conflicting interests.
        </Reveal>

        <Reveal className="hero-actions" delay={260}>
          <a className="btn btn-gold" href="#contact">Let’s Talk <Arrow /></a>
          <a className="btn btn-ghost" href="#divisions">See the Work</a>
        </Reveal>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span>Scroll</span>
        <i />
      </div>
    </section>
  )
}

function Marquee() {
  const items = [...MARQUEE, ...MARQUEE]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items.map((t, i) => <span key={i}>{t}</span>)}
      </div>
    </div>
  )
}

function Divisions() {
  return (
    <section id="divisions" className="divisions">
      <article className="division">
        <div className="division-art art-talent" />
        <span className="num">01 / Talent</span>
        <h3 className="display h-lg">Talent Management</h3>
        <p>
          Full representation for people whose name is the business. We run the deals,
          the room, and the ten-year plan behind both.
        </p>
        <ul>
          <li>Contract negotiation &amp; deal structuring</li>
          <li>Brand partnerships and equity endorsements</li>
          <li>Publicity, press, and narrative strategy</li>
          <li>Touring, appearance, and calendar operations</li>
        </ul>
        <a className="btn-line" href="#roster">Meet the Roster <Arrow /></a>
      </article>

      <article className="division">
        <div className="division-art art-realty" />
        <span className="num">02 / Realty</span>
        <h3 className="display h-lg">Real Estate Advisory</h3>
        <p>
          Acquisition, disposition, and portfolio strategy for clients whose income
          arrives in bursts and needs somewhere permanent to live.
        </p>
        <ul>
          <li>Off-market sourcing and private acquisitions</li>
          <li>Portfolio modeling and hold/exit analysis</li>
          <li>Development and value-add advisory</li>
          <li>Entity structuring and succession planning</li>
        </ul>
        <a className="btn-line" href="#portfolio">See the Portfolio <Arrow /></a>
      </article>
    </section>
  )
}

function Services() {
  return (
    <section className="section" id="services">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow center">What We Do</span>
          <h2 className="display h-lg">Six lanes, one desk<span className="dot">.</span></h2>
          <div className="rule" />
        </Reveal>

        <div className="services-grid">
          {SERVICES.map((s, i) => (
            <Reveal as="article" className="service" key={s.title} delay={i * 70} from="rise">
              <span className="idx">{String(i + 1).padStart(2, '0')}</span>
              <Icon name={s.icon} />
              <h4>{s.title}</h4>
              <p>{s.copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="stats">
      <div className="wrap">
        <div className="stats-grid">
          {STATS.map(([value, label], i) => (
            <Reveal className="stat" key={label} delay={i * 80} from="zoom">
              <CountUp value={value} />
              <span>{label}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Roster() {
  return (
    <section className="section" id="roster">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow center">The Roster</span>
          <h2 className="display h-lg">Who we run with<span className="dot">.</span></h2>
          <div className="rule" />
        </Reveal>

        <div className="feature">
          <Reveal className="feature-shot" from="left">
            <img src={FEATURED.image} alt={FEATURED.alt} width="1638" height="2048" loading="lazy" />
          </Reveal>

          <Reveal className="feature-body" delay={120} from="right">
            <span className="feature-tag">{FEATURED.tag}</span>
            <h3 className="display h-lg">{FEATURED.name}</h3>
            <p className="lede">{FEATURED.bio}</p>

            <div className="feature-stats">
              {FEATURED.stats.map(([value, label]) => (
                <div key={label}>
                  <b>{value}</b>
                  <span>{label}</span>
                </div>
              ))}
            </div>

            <a className="btn-line" href="#contact">Work With Us <Arrow /></a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* Properties live in Sanity. Until the project id is set the board simply
   reports that it is empty rather than shipping placeholder listings. */
function useProperties() {
  const [state, setState] = useState({ status: sanityReady ? 'loading' : 'off', items: [] })

  useEffect(() => {
    if (!sanityReady) return
    let live = true
    sanity
      .fetch(PROPERTY_QUERY)
      .then((items) => live && setState({ status: 'ready', items: items || [] }))
      .catch((err) => {
        console.error('Could not load properties', err)
        if (live) setState({ status: 'error', items: [] })
      })
    return () => { live = false }
  }, [])

  return state
}

function Portfolio() {
  const { status, items } = useProperties()

  return (
    <section className="section" id="portfolio">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow center">On the Board</span>
          <h2 className="display h-lg">Deals we closed<span className="dot">.</span></h2>
          <div className="rule" />
        </Reveal>

        {status === 'loading' && (
          <div className="portfolio" aria-hidden="true">
            {[0, 1, 2].map((i) => <div className="prop skeleton" key={i} />)}
          </div>
        )}

        {status !== 'loading' && items.length === 0 && (
          <Reveal className="board-empty">
            <p>The board is being updated. New closings post here as they clear.</p>
            <a className="btn-line" href="#contact">Ask what we are working on <Arrow /></a>
          </Reveal>
        )}

        {items.length > 0 && (
          <div className="portfolio">
            {items.map((p, i) => {
              const src = imageUrl(p.photo, 1200)
              return (
                <Reveal as="article" className={`prop ${p.size || ''}`} key={p._id} delay={i * 80} from="zoom">
                  <div
                    className={`prop-art ${src ? '' : 'art-fallback'}`}
                    style={src ? { backgroundImage: `url(${src})` } : undefined}
                  />
                  {p.tag && <span className="prop-tag">{p.tag}</span>}
                  <h4>{p.name}</h4>
                  {p.meta?.length > 0 && (
                    <div className="meta">
                      {p.meta.map((m) => (
                        <div key={m.label}>
                          <span>{m.label}</span>
                          <b>{m.value}</b>
                        </div>
                      ))}
                    </div>
                  )}
                </Reveal>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="section light" id="process">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow center">How We Work</span>
          <h2 className="display h-lg">First call to forever<span className="dot">.</span></h2>
          <div className="rule" />
        </Reveal>

        <div className="process">
          {PROCESS.map(([phase, title, copy], i) => (
            <Reveal className="step" key={phase} delay={i * 90} from="left">
              <div className="step-top">
                <span className="step-dot" />
                <span className="step-line" />
              </div>
              <em>{phase}</em>
              <b>{title}</b>
              <p>{copy}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  const [i, setI] = useState(0)
  const timer = useRef(null)

  const go = useCallback((n) => {
    setI(n)
    if (timer.current) clearInterval(timer.current)
  }, [])

  useEffect(() => {
    timer.current = setInterval(() => setI((v) => (v + 1) % QUOTES.length), 7000)
    return () => clearInterval(timer.current)
  }, [])

  return (
    <section className="section">
      <div className="wrap">
        <Reveal className="section-head">
          <span className="eyebrow center">In Their Words</span>
        </Reveal>

        <div className="quote-stage">
          {QUOTES.map((q, n) => (
            <div className={`quote ${n === i ? 'on' : ''}`} key={q.name} aria-hidden={n !== i}>
              <div className="quote-avatar" aria-hidden="true">{q.name[0]}</div>
              <blockquote>{q.text}</blockquote>
              <div className="who">
                <b>{q.name}</b>
                <span>{q.role}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="quote-nav">
          {QUOTES.map((q, n) => (
            <button
              type="button"
              key={q.name}
              className={n === i ? 'on' : ''}
              aria-label={`Testimonial ${n + 1} of ${QUOTES.length}`}
              aria-current={n === i}
              onClick={() => go(n)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

const EMPTY = { name: '', email: '', phone: '', interest: '', message: '' }

function Contact() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    // No backend yet. Log the payload and confirm to the visitor.
    console.info('Consultation request', form)
    setSent(true)
    setForm(EMPTY)
  }

  return (
    <section className="cta" id="contact">
      <div className="wrap cta-grid">
        <Reveal>
          <span className="eyebrow">Begin</span>
          <h2 className="display h-lg">
            Tell us what you’re <span className="gold-text">building</span>.
          </h2>
          <p className="lede">
            Every engagement starts with a real conversation. No pitch deck, no
            obligation. We take a limited number of clients a year, so the answer is
            sometimes no, and always straight.
          </p>
        </Reveal>

        <Reveal delay={120}>
          {sent ? (
            <div className="form-sent" role="status">
              <b>Received.</b>
              <p>
                Thank you. A partner will reach out within one business day to schedule
                your consultation.
              </p>
            </div>
          ) : (
            <form className="form" onSubmit={submit}>
              <div className="field">
                <input
                  type="text" required placeholder="Full name" aria-label="Full name"
                  value={form.name} onChange={set('name')}
                />
              </div>
              <div className="field">
                <input
                  type="email" required placeholder="Email address" aria-label="Email address"
                  value={form.email} onChange={set('email')}
                />
              </div>
              <div className="field">
                <input
                  type="tel" placeholder="Phone (optional)" aria-label="Phone"
                  value={form.phone} onChange={set('phone')}
                />
              </div>
              <div className="field">
                <select required aria-label="Area of interest" value={form.interest} onChange={set('interest')}>
                  <option value="">What are you here for?</option>
                  <option value="talent">Talent Management</option>
                  <option value="realty">Real Estate Advisory</option>
                  <option value="both">Both Divisions</option>
                  <option value="other">Something Else</option>
                </select>
              </div>
              <div className="field">
                <textarea
                  placeholder="Tell us about you and what you need" aria-label="Message"
                  value={form.message} onChange={set('message')}
                />
              </div>
              <button type="submit" className="btn btn-gold">
                Send It <Arrow />
              </button>
              <p className="form-note">Confidential. We never share your information.</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <a className="logo" href="#top">
              <span className="logo-word">
                <b>BRIOSO</b>
                <small>Empowered LLC</small>
              </span>
            </a>
            <p className="blurb">
              Talent management and real estate advisory. We build careers,
              portfolios, and legacies.
            </p>
            <div className="socials">
              {SOCIALS.map(([label, href, d]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h6>Divisions</h6>
            <ul>
              <li><a href="#divisions">Talent Management</a></li>
              <li><a href="#divisions">Real Estate Advisory</a></li>
              <li><a href="#services">Brand Partnerships</a></li>
              <li><a href="#services">Portfolio Strategy</a></li>
            </ul>
          </div>

          <div>
            <h6>Company</h6>
            <ul>
              <li><a href="#roster">Roster</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#process">Process</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>

          <div>
            <h6>The Brief</h6>
            <p className="blurb">
              Quarterly notes on talent deals and property markets. No noise.
            </p>
            <form
              className="sub"
              onSubmit={(e) => { e.preventDefault(); setJoined(true); setEmail('') }}
            >
              <input
                type="email" required placeholder="Your email" aria-label="Email for newsletter"
                value={email} onChange={(e) => setEmail(e.target.value)}
              />
              <button type="submit">{joined ? 'Done' : 'Join'}</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {YEAR} Brioso Empowered LLC. All rights reserved.</span>
          <span>
            <a href="#top">Privacy</a> · <a href="#top">Terms</a> · <a href="#contact">hello@briosoempowered.com</a>
          </span>
        </div>

        <div className="credit">
          <span>Created with <span className="heart" aria-hidden="true">❤</span><span className="sr-only">love</span> by</span>
          <a href="https://moguldesignagency.com/" target="_blank" rel="noreferrer">
            <img className="credit-mark" src={mogulLogo} alt="" width="15" height="22" loading="lazy" />
            Mogul Design Agency
          </a>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */

export default function App() {
  useReveal()

  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Divisions />
        <Services />
        <Stats />
        <Roster />
        <Portfolio />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
