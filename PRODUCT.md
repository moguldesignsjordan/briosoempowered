# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Brioso Empowered LLC's marketing site serves four overlapping audiences:

- **Talent seeking management** — athletes/creators/entertainers evaluating Brioso as their management firm.
- **Property owners/sellers** — people wanting to list a property (via `/list`) or explore the property portfolio/board.
- **Investors/partners** — people evaluating Brioso as a business or investment partner.
- **Prospective clients (general)** — a broad mix researching credibility before reaching out through any channel.

All four are researching credibility and fit before making contact; the site's job is to earn that first outreach, not to close a transaction on-page.

## Product Purpose

Brioso Empowered LLC is a talent management and real estate advisory firm. The site presents both divisions (talent management + real estate), showcases the property portfolio (live from Sanity), lets clients submit properties for review (`/list`), and lets Brioso staff manage/publish listings (`/manage`). Success is a qualified visitor reaching out or submitting a property.

## Positioning

Founder/network credibility is the core differentiator — reputation, relationships, and a specific track record (e.g. the Baldo Mindset partnership) are what a competitor couldn't simply copy. This is distinct from "dual expertise" being the pitch; the trust comes from who Brioso is connected to and has worked with, not just the breadth of services offered.

## Operating Context

- Properties are managed through Sanity: clients submit via a branded form at `/list`, which posts to a serverless API (`api/submit-property.js`) and files the property as a draft. Brioso staff review and publish at `/manage`, signed in with the Sanity account that owns the project.
- The site ships English and Spanish (`src/i18n/en.js` / `es.js`), with language chosen via `?lang=es`, then localStorage, then browser language.
- Deployed on Vercel, building from `main`.

## Capabilities and Constraints

- The write token for Sanity (`SANITY_WRITE_TOKEN`) lives only in the host environment, never in the browser bundle or repo — this is why submissions go through a serverless function rather than directly from the page.
- The contact form currently has no backend (logs to console, shows a success state) — known gap, not yet wired to a real endpoint.
- The footer newsletter signup is front-end only — known gap.
- Property content is not translated; it is whatever was typed into the Studio (English/Spanish parity applies to site copy, not listing content).

## Brand Commitments

- Name: Brioso Empowered LLC.
- Confirmed partnership/proof asset: Baldo Mindset (featured site link + logo in the codebase).
- Visual identity already established and documented in README as "Acid Court": concrete black with light champagne gold and warm amber accent, Archivo Black display type, Space Grotesk body, pill buttons, rounded cards, tilted sticker badges, hard offset-shadow hovers. (Full token/system detail belongs in DESIGN.md, not here.)

## Evidence on Hand

- Baldo Mindset partnership is real (featured property/site link in `FEATURED` data, `baldoImg` asset).
- **Roster and testimonial copy (`ROSTER`, `QUOTES` in `src/App.jsx`) is placeholder — not real clients or quotes.** Future work must not treat these as proof, cite them as evidence, or expand on them as if factual; ask before replacing or before treating them as real.
- Properties displayed on the portfolio board are live/real, sourced from Sanity.

## Product Principles

- Credibility is carried by real relationships and specific proof (e.g. Baldo Mindset), not generic claims — don't manufacture testimonials or stats to fill gaps.
- The site serves distinct audiences (talent, property owners, investors) with one shared brand voice — don't fragment the experience by audience.
- Property submission and management is a real operational workflow (Sanity-backed, token-gated) — treat it as production infrastructure, not a placeholder form.
- Bilingual parity (EN/ES) is a hard constraint for site copy — any new copy needs both languages, key-for-key.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond general web standards. Existing implementation already accounts for reduced-motion-friendly hover handling (`hover: hover` media guard) and iOS zoom prevention on form inputs; treat these as constraints to preserve.
