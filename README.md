# Yoshwan Pathipati — portfolio

A single-page portfolio built as an engineering dossier: part aerospace flight manual, part security
assessment report. The design system, its rationale, and the wireframe are in [DESIGN.md](DESIGN.md).

Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · static export. No animation library, no UI
kit: the only runtime dependencies are `next`, `react`, and `react-dom`.

---

## Run it locally

```bash
npm install
```

```bash
npm run dev
```

Then open <http://localhost:3000>.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Static export to `out/` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run assets` | Regenerates `og.png`, the favicon set, and the placeholder résumé |

---

## The two files you will actually edit

**`src/lib/content.ts`** holds every word and fact on the site: hero copy, experience entries, projects,
skills, links, the telemetry numbers. Components read from it and render nothing that is not defined
there, so you can rewrite the site's text without opening a component.

One house rule is enforced there: no em-dashes in anything that reaches the page. Use commas, colons,
parentheses, or periods instead.

**`public/resume.pdf`** is a placeholder. Drop the real PDF in at that exact path and every download
button picks it up. (`npm run assets` will not overwrite a résumé that is already there.)

### Optional headshot

Add `public/headshot.jpg` and set `hasHeadshot: true` in `content.ts`. The Profile section is built so
that the layout is correct either way, so leaving it `false` is a supported state, not a broken one.

---

## Deploying

The build is a plain static export: `next build` writes `out/`, and any static host can serve it.

### Vercel

1. Push the repo to GitHub.
2. In Vercel, **Add New → Project** and import it.
3. Accept the detected defaults and deploy. Nothing to configure.
4. After attaching your domain, set `url` in `src/lib/content.ts` to it. That value drives the canonical
   link, the sitemap, and the absolute URLs in the Open Graph and Twitter cards.

### GitHub Pages

Works with no changes if you deploy to a **user site** (`yourname.github.io`). For a **project site**
served from a subpath (`yourname.github.io/portfolio`), set `NEXT_PUBLIC_BASE_PATH` at build time so
asset links resolve; `next.config.ts` and the `asset()` helper both read it.

Add `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      # Drop the NEXT_PUBLIC_BASE_PATH line entirely for a user site.
      - run: npm run build
        env:
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then set **Settings → Pages → Source** to **GitHub Actions**.

---

## Measured results

Lighthouse, production build served with gzip:

| | Performance | Accessibility | Best practices | SEO |
| --- | --- | --- | --- | --- |
| Desktop | 100 | 100 | 100 | 100 |
| Mobile | 95–97 across 5 consecutive runs | 100 | 100 | 100 |

Mobile: FCP 0.9s, **CLS 0**, TBT ~100ms, LCP 2.4–2.9s. LCP is dominated by React hydration, which is
the framework's floor for a page this size rather than anything in the application code; disabling the
hero canvas entirely was measured and moved it not at all.

Two optimisations were tried, measured, and reverted, which is why they are not in the code: dropping
the mono font's preload (cost CLS 0.12, since the labels are load-bearing structure) and building with
webpack instead of Turbopack (567KB vs 573KB of JS, i.e. no difference).

Also verified: no horizontal scroll from 320px to 1440px+, AA contrast on all 204 text nodes in **both**
themes, full keyboard traversal with a visible focus ring at every stop, and every string in
`content.ts` present verbatim in the served HTML.

---

## Notes on a few decisions

**Fonts** are self-hosted at build time by `next/font` (Archivo, Instrument Sans, IBM Plex Mono). No
request leaves the page at runtime, and the metrics-matched fallbacks hold CLS at zero.

**Type sizes are computed, not eyeballed.** The clamp floors are set by the longest unbreakable word in
each role, which is why the headline can never force a horizontal scroll at 320px.

**The page degrades honestly without JavaScript.** The scroll reveals' hidden state is gated on a
`data-js` attribute set by an inline script, and a `<noscript>` rule unhides everything, so the full
document is readable with the bundle blocked. The counters server-render their final values rather
than zero, for the same reason.

**`content-visibility` and anchor links.** Off-screen sections skip layout until needed, which is the
single largest first-load win on a page this tall. Since the size hints are estimates, `Nav` releases
them on the visitor's first pointer or key event, before any link can be clicked, so anchor scrolling
always lands on real layout.

**`og.png` is generated, not hand-drawn** (`scripts/generate-assets.mjs`), and is committed. It is
rasterised by sharp using system fonts, so Arial Black stands in for Archivo on the card. Re-run
`npm run assets` only if you change the card design.

---

Designed and built by Yoshwan Pathipati.
