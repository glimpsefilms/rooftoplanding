# Rooftop Management — Landing Page

A premium, single-screen landing page for Rooftop Management. Black canvas,
white type, electric-blue accent, massive negative space. The icon draws itself
in, the wordmark resolves from blur, and the mark stays quietly alive — a slow
breathing glow, an occasional specular sweep, and a highlight that grazes the
icon as the cursor moves.

There are two copies of the same design:

| Path | What it is | When to use |
|------|------------|-------------|
| **`index.html`** | Self-contained. No build, no dependencies, no network modules. Just open it. | Instant preview, drop onto any static host as-is. |
| **`react/`** | Vite + React + TypeScript + Tailwind + Framer Motion. | Integrating into a React stack / your existing pipeline. |

Both render identically. `index.html` is the reference that was visually
verified frame-by-frame against the source logo.

---

## Run it

### Standalone (`index.html`)
Open the file directly, or serve the folder:
```bash
cd rooftop_landing
python3 -m http.server 5173
# → http://127.0.0.1:5173/index.html
```

### React app (`react/`)
Requires Node 18+.
```bash
cd rooftop_landing/react
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle → dist/
```

---

## Design decisions (so they survive future edits)

**The icon is traced, not approximated.** The SVG path was reconstructed from the
pixels of the supplied artwork: apex at `(111,1)`, roof corners at `(3,73)` and
`(219,73)`, verticals dropping to `y=231`, and a centre spire running apex→base,
all in a `222 × 232` viewBox. The blue "polished-metal" face (`GLOSS`) is the lit
panel on the inner-right of the spire.

**Typography — one face, used throughout: Jost (Google Fonts).**
The whole page is set in **Jost** — `300` for ROOFTOP and the address, `400`
(tracked) for MANAGEMENT. It's a Futura-style geometric chosen for an
understated, luxury-editorial feel (Aman / A24 / Porsche), and it's thin enough
to echo the logo's hairline weight. A single typeface keeps the page feeling
intentional; hierarchy comes from size, weight, colour, and tracking.

> **Note on exact-logo matching:** the source logo's wordmark is actually set in
> a wide, superelliptical face — the closest match is **Michroma**. We
> deliberately moved to Jost because Michroma reads slightly "technical / sci-fi"
> at large sizes, which fought the luxury references. If you ever need the site
> to match the logo file bit-for-bit, swap the `font-family` back to
> `"Michroma"` (load it from Google Fonts) on `.wordmark` / `.submark` and set
> their weight to `400`, letter-spacing `0.1em` / `0.34em`.

**The animation is restrained on purpose.**

| Phase | Timing |
|-------|--------|
| Icon draws itself (outer outline, then centre spire) | 0 → ~1.45s |
| `ROOFTOP` fades in, blur-to-sharp | from 1.5s |
| `MANAGEMENT` + divider rules | from 1.8s |
| Address (tick, then lines) | from 2.45s |
| Idle: breathing glow on the icon | 10s loop, forever |
| Idle: specular light sweep across the icon | ~once every 24s |
| Cursor: highlight grazes the mark (~1–2% drift) | continuous |

`prefers-reduced-motion` collapses everything to the final, static state.

---

## Customising

- **Accent colour** — change `--accent` (`#2EA7FF`). In the React app it's also
  the Tailwind `accent` token (`tailwind.config.js`).
- **Address** — edit the two lines in `index.html` / `react/src/App.tsx`.
- **Scale & spacing** — the lockup is sized in `clamp()`s; the `.submark-row`
  dividers stretch to the wordmark's width automatically.
- **Sweep frequency** — the `sheen` timing (`repeatDelay`) controls how often the
  light passes.

## Deploy

Either copy `index.html` to any static host (Vercel, Netlify, S3, GitHub Pages),
or deploy `react/`'s `dist/` after `npm run build`. Both are fully static.
