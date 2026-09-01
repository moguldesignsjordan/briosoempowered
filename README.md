# Brioso Empowered

Marketing site for Brioso Empowered LLC, a talent management and real estate
advisory firm. Single-page React app built with Vite.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command           | What it does                        |
| ----------------- | ----------------------------------- |
| `npm run dev`     | Dev server with HMR                 |
| `npm run build`   | Production build to `dist/`         |
| `npm run preview` | Serve the production build locally  |
| `npm run lint`    | Oxlint                              |

## Structure

```
index.html      fonts, meta, favicon
src/main.jsx    React entry
src/App.jsx     every section + page content (see the data block up top)
src/index.css   the design system
```

Page content lives in plain arrays at the top of `src/App.jsx` (`SERVICES`,
`ROSTER`, `PROCESS`, `QUOTES`, `STATS`). Edit those to change copy; you
shouldn't need to touch the markup.

Properties are the exception: they come from Sanity, so they are added through
the manager rather than in code (see below).

## Two ways properties get added

**Clients** use the branded form at **`/list`**. It posts to
`api/submit-property.js`, which files the property as a *draft* — nothing a
stranger types reaches the live board. Photos are downscaled in the browser
first, then uploaded server-side.

**You** review and publish at **`/manage`**. Drafts from the form show up
there with the submitter's name, email, phone, and notes attached as read-only
fields. Hit Publish and it goes on the board.

The write token lives only in the host's environment (`SANITY_WRITE_TOKEN`),
never in the browser bundle and never in this repo. That is the whole reason
submissions go through a serverless function instead of straight from the page.

### The manager

Go to **`/manage`** on the site and sign in with the Sanity account that owns
the project. New → Property → name, deal type, photo, up to three stats →
Publish. It shows up on the board on the next page load.

That page is a lazy chunk, so visitors to the marketing site never download it.
Sanity handles the login, which is why no write token exists anywhere in this
repo: whoever is signed in writes as themselves.

Setup, once per machine:

```bash
cp .env.example .env     # then paste the project id from sanity.io/manage
```

Before launch, add the live site's URL under **API → CORS origins** at
sanity.io/manage (leave "allow credentials" off for the public site; the
`/manage` login needs it on for that origin).

Schemas are in `src/studio/`. `post.js` is scaffolded for a journal but nothing
on the site reads it yet.

## Design system

"Acid Court": concrete black with light champagne gold and a warm amber
secondary accent. Archivo Black for display type, Space Grotesk for body. Pill buttons,
rounded cards, tilted sticker badges, and hard offset-shadow hovers.

All design tokens are CSS custom properties in the `:root` block of
`src/index.css`. Recoloring the site is a matter of changing `--gold` and
`--amber`.

The stylesheet is **mobile first**: base rules target the smallest screen and
every media query is `min-width`. Breakpoints are 480 / 600 / 700 / 900 / 1000
/ 1100. Hover effects are wrapped in `@media (hover: hover) and (pointer:
fine)` so touch devices don't get stuck hover states, and form inputs are 16px
on mobile to stop iOS Safari zooming on focus.

## Known gaps

- **The contact form has no backend.** `Contact` in `src/App.jsx` logs the
  payload to the console and shows a success state. Wire it to a form endpoint
  or API route before launch.
- **Roster and testimonial content is placeholder copy.** Swap in real
  clients and quotes. Properties are live from Sanity.
- Footer newsletter signup is also front-end only.
