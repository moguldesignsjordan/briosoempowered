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
`ROSTER`, `PROPS`, `PROCESS`, `QUOTES`, `STATS`). Edit those to change copy;
you shouldn't need to touch the markup.

## Design system

"Acid Court": concrete black with champagne gold, ultraviolet as a secondary
accent. Archivo Black for display type, Space Grotesk for body. Pill buttons,
rounded cards, tilted sticker badges, and hard offset-shadow hovers.

All design tokens are CSS custom properties in the `:root` block of
`src/index.css`. Recoloring the site is a matter of changing `--gold` and
`--uv`.

The stylesheet is **mobile first**: base rules target the smallest screen and
every media query is `min-width`. Breakpoints are 480 / 600 / 700 / 900 / 1000
/ 1100. Hover effects are wrapped in `@media (hover: hover) and (pointer:
fine)` so touch devices don't get stuck hover states, and form inputs are 16px
on mobile to stop iOS Safari zooming on focus.

## Known gaps

- **The contact form has no backend.** `Contact` in `src/App.jsx` logs the
  payload to the console and shows a success state. Wire it to a form endpoint
  or API route before launch.
- **Roster, portfolio, and testimonial content is placeholder copy.** Swap in
  real clients and transactions.
- Footer newsletter signup is also front-end only.
