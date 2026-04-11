# Tavern Log — Web

Next.js 14 frontend for [tavernlog.kasparas.dev](https://tavernlog.kasparas.dev). Part of the `tavern-log` monorepo.

## Stack

- Next.js 14, App Router, React Server Components
- Tailwind CSS with CSS custom properties for per-character theming
- TanStack Query v5 — RSC prefetch + HydrationBoundary pattern
- Tiptap (admin rich text editor), DOMPurify (render sanitisation)
- Framer Motion — per-character page transitions
- Vitest + React Testing Library

## Running locally

From the **repo root**:

```bash
docker compose up -d   # start local Postgres
npm install
npm run dev            # starts web (port 3000) and api (port 3001) concurrently
```

## Environment variables

Create `apps/web/.env.local`:

```
API_URL=http://localhost:3001
```

## Tests

```bash
npm test --workspace=apps/web
```

## Deployment

Deployed to Vercel at `tavernlog.kasparas.dev`. Auto-deploys on push to `master` after CI passes.
