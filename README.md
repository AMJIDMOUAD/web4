# Exoverse — Web4 (Next.js + Tailwind)

Pixel-exact neon homepage with hotspots and a collapsible, file-backed info panel.

## Requirements
- Node.js 18+
- npm or pnpm or yarn

## Quick start
```bash
# 1) Install deps
npm install

# 2) Run dev server
npm run dev
# → open http://localhost:3000

# 3) Build & start (production)
npm run build
npm start
```

The API saves content to **.data/homepage.info.json** and keeps a history in **.data/homepage.info.history.jsonl**.

## Files
- `src/app/page.tsx` — homepage hero + hotspots + panel
- `src/app/api/homepage/info/route.ts` — GET/POST file-backed API
- `src/styles/globals.css` — Tailwind + custom CSS
- `public/assets/exoverse-hero-night.jpg` — hero artwork
- `.data/` — created automatically for saved content

_Last generated: 2025-10-01T15:11:03.588601Z_
