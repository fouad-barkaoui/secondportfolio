# Fouad Barkaoui — portfolio (Next.js)

Minimal single-column portfolio: intro + two doors on the home page, horizontal
screenshot rails for each project, lightbox, keyboard navigation, light/dark theme
and a three.js "signal field" in the background.

## Stack

| | |
|---|---|
| Framework | **Next.js 16** (App Router), **React 19**, **TypeScript** (strict) |
| Animation | **Motion** (lightbox open/close/step), CSS transitions for page enter/leave |
| 3D | **three.js** — custom shader point field, lazy-loaded after hydration |
| Theme | **next-themes** — system by default, remembered, no flash on load; View Transitions circular reveal |
| Fonts | **Geist** (self-hosted via `geist`), Mrs Saint Delafield (signature, `@fontsource`) |
| Output | Static export (`out/`) — deploy anywhere |

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in out/
npm start          # serve out/ locally
npm run lint       # ESLint (next/core-web-vitals + typescript)
npm run typecheck
```

Node 20.9 or newer.

## Shortcuts

| Key | Action |
|---|---|
| `S` | Selected work (again = home) |
| `E` | Explorations (again = home) |
| `Esc` | Back home / close lightbox |
| `T` | Toggle light / dark |
| `← →` | Previous / next shot in the lightbox |

Rails: the mouse wheel scrolls sideways, drag with the mouse, and keep scrolling past
the end of the last rail to open the next page.

## Where things live

| What | Where |
|---|---|
| All text, projects, screenshots, page setup | `src/content/site.ts` |
| Pages | `src/app/` (`page.tsx`, `selected/`, `explorations/`) |
| Home pieces (avatar, hover text, tiles) | `src/components/home/` |
| Rails + lightbox | `src/components/work/` |
| three.js background | `src/components/SignalField.tsx` |
| Theme toggle + logic | `src/components/ThemeToggle.tsx`, `src/lib/theme.ts` |
| Animated navigation | `src/lib/navigation.tsx` |
| Styles + light/dark tokens | `src/app/globals.css` |
| Screenshots, avatar, favicon, OG image | `public/` |

To add a project: add it to `projects` in `site.ts`, put its screenshots in
`public/assets/`, and list its id in `pages.selected.projects` or `pages.explorations.projects`.

## Accessibility & performance

- Respects `prefers-reduced-motion` (three.js renders one still frame, no blur/zoom animations).
- Keyboard: skip link, visible focus rings, shortcuts ignored while typing, focus returns to the shot after the lightbox closes.
- three.js loads after first paint, caps pixel ratio, pauses when the tab is hidden, and the site works without WebGL.

## Deploy

Vercel: import the folder (framework preset Next.js) or run `vercel --prod`.
`vercel.json` adds security headers and long caching for `/assets`.
Any other static host: upload `out/` after `npm run build`.

Change `SITE_URL` in `src/content/site.ts` to the final domain (used for canonical URLs, sitemap, OG).
