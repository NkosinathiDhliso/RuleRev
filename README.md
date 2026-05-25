# RuleRev - rulerev.com

Marketing site for RuleRev. Next.js 15 (App Router) + TypeScript + Tailwind v4 + MDX.
Production target: Netlify, custom domain `rulerev.com` (apex), `www` 301-redirected.

## Quickstart

```bash
npm install
cp .env.example .env.local   # then fill values you have
npm run dev                  # http://localhost:3000
```

## Scripts

- `npm run dev` - local dev server
- `npm run build` - production build
- `npm run start` - production server (after `build`)
- `npm run lint` - Next.js eslint
- `npm run typecheck` - TypeScript

## Environment variables

All values are optional in development. The site renders with sensible defaults and `TBD` placeholders when they are missing.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL. Defaults to `https://rulerev.com`. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID. If empty, no GA scripts are injected. |
| `NEXT_PUBLIC_CALENDLY_URL` | Cal.com or Calendly URL. If empty, "Book a call" falls back to `mailto:`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, e.g. `27614509800`. |
| `NEXT_PUBLIC_PHONE_INTL` | E.164 with `+`, e.g. `+27614509800`. |
| `NEXT_PUBLIC_PHONE_LOCAL` | Display-formatted local number. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Founder email used in `mailto:` links. |
| `NEXT_PUBLIC_CIPC_REG` | CIPC registration number for footer. |

## Project structure

```
src/
  app/                    # App Router pages, routes, sitemap, robots, OG, RSS, icons
    work/[slug]/          # Case study dynamic route - reads MDX from src/content/case-studies
    services/             # Services page with three anchored productised offers
    writing/[slug]/       # Article dynamic route - reads MDX from src/content/articles
    writing/rss.xml/      # RSS feed route
    og/                   # 1200×630 OG image (edge runtime, @vercel/og)
    icon.tsx, apple-icon.tsx
    layout.tsx, page.tsx, not-found.tsx
    sitemap.ts, robots.ts, globals.css
  components/             # All UI components (CSS Modules alongside)
  content/
    case-studies/         # Featured case study MDX + index.ts data layer
    articles/             # /writing MDX + index.ts data layer
    services.ts           # Productised offer data
  lib/                    # site, whatsapp, analytics, format, nav, jsonld, mdx
```

## Content authoring

- Case studies: add `src/content/case-studies/<slug>.mdx` and add an entry to `FEATURED_CASE_STUDIES` in `src/content/case-studies/index.ts`.
- Articles: add `src/content/articles/<slug>.mdx` and add an entry to `ARTICLES` in `src/content/articles/index.ts`.

## Conventions

- Locale: `en-ZA`. British English spelling (`organisation`, `optimisation`, `colour`).
- Currency: `R15 000` (R prefix, space thousands separator, no decimals).
- Dates: `25 May 2026`.
- Phone: `+27 61 450 9800` for international display, `tel:+27614509800` for links.

## Deployment (Netlify)

- Connect this repo as a Netlify site.
- Build command and publish dir come from `netlify.toml` (`npm run build`, `.next`).
- Netlify auto-detects Next.js and installs `@netlify/plugin-nextjs`. The plugin handles SSR/ISR/Edge routes (`/og`, `/icon`, `/apple-icon`, dynamic case studies and articles) - no extra config needed.
- Add the custom domain `rulerev.com` in Netlify → Domain Management. Set `rulerev.com` as the primary; `www.rulerev.com` is force-redirected to apex via `netlify.toml`.
- Set environment variables in **Site settings → Environment variables** (same keys as `.env.example`).
- Deploy previews: enabled by default for every PR. Branch deploys: optional.

## Pre-flight checklist (defaults applied)

| # | Item | Default in this build |
|---|---|---|
| 1 | Service prices | `From R-` placeholder until set in `src/content/services.ts` |
| 2 | Calendly URL | Falls back to `mailto:` until `NEXT_PUBLIC_CALENDLY_URL` is set |
| 3 | WhatsApp number | `+27 61 450 9800` (override via env) |
| 4 | Founder photo | Accent monogram `ID` block in `/about` |
| 5 | Client testimonials | Omitted (no fabrication) |
| 6 | CIPC registration number | Empty placeholder in footer until env var set |
| 7 | Accent colour | `#3B6BB8` (in `globals.css`) |
| 8 | Stack | Fresh Next.js 15, no Vite migration |
| 9 | Deployment target | Netlify, deploy previews on PRs |
| 10 | Canonical domain | `rulerev.com` apex; `www` → apex 301 |
| 11 | Small TBD spans in RT Dynamic / THFC case studies | Rendered as inline `tbd` callouts |
| 12 | IP Navigator and KafenFarm one-liners | Card shows project name + URL + `Coming soon` |

## Legacy

The previous Vite + React + Three.js site is archived under `_legacy-vite/` for reference. Nothing in there is loaded by the Next.js build.
