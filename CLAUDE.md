# Brioso Empowered

Marketing site for Brioso Empowered LLC (talent management and real estate
advisory). Vite + React in plain JSX, Sanity for properties and inquiries, two
Vercel serverless functions in `api/`. Root `MDA/CLAUDE.md` conventions apply here too.

## Read before non-trivial work
- `README.md` Sanity setup, Vercel env vars, CORS, deploy notes.
- `PRODUCT.md` audiences, positioning, operating context.
- `DESIGN.md` "Acid Court" tokens, type scale, motion.

## Commands
```bash
npm run build     # production build to dist/
npm run lint      # oxlint
```
No typecheck and no tests: lint plus build is the only signal.

## Architecture
- No router. `src/main.jsx` picks the view from the path or hash: `/manage`
  lazy-loads the Sanity Studio (`src/studio/Manager.jsx`), `/list` renders the
  property form (`src/SubmitProperty.jsx`), everything else renders `App`.
- All user-visible copy lives in `src/i18n/en.js` and `src/i18n/es.js`, which
  must stay key-for-key identical (a missing key renders `undefined`, not English).
  The README's note about content arrays in `App.jsx` predates the translation.
- Public reads use plain fetch in `src/lib/sanity.js` to keep `@sanity/client`
  out of the visitor bundle. Only the `/manage` chunk may import the full client.
- Public writes go through `api/submit-property.js` and `api/submit-contact.js`,
  which file drafts with `SANITY_WRITE_TOKEN`. That token must never become a
  `VITE_` variable or reach the browser.
- Schemas are in `src/studio/`. `post` is scaffolded but nothing reads it yet.

## Styling (differs from the agency default)
- Plain CSS, no Tailwind. Tokens are custom properties in the `:root` block of
  `src/index.css`.
- Mobile first, `min-width` queries only. Hover effects go inside
  `@media (hover: hover) and (pointer: fine)`.
- Single dark theme. There is no light mode.
