# Tavern Log — Claude Context

## Project Overview

A character archive and showcase platform for TTRPG players. Each character gets a dedicated profile page with short stories, voice lines, an art gallery, a timeline, and per-character theming. Phase 1 is a single-user personal archive. Phase 2 adds multi-user accounts and a social layer.

**Vault planning notes:** `$OBSIDIAN_VAULT/Projects/Tavern Log/`

- `Plan.md` — full milestone plan, schema, dependencies, architectural decisions
- `Sprint.md` — current active tasks
- `Decisions.md` — decision log with rationale for all major architectural choices

Always cross-reference the vault when making architectural decisions or checking the current sprint. The vault is the source of truth for planning.

### Setting up on a new machine

`OBSIDIAN_VAULT` is set in `.claude/settings.local.json` (gitignored — not committed). On each machine, create the file with the correct local path:

```json
{
  "env": {
    "OBSIDIAN_VAULT": "/path/to/your/Henc/obsidian"
  }
}
```

The file lives at `<repo root>/.claude/settings.local.json`. Create it if it doesn't exist.

---

## Planning policy

When a planning or architecture discussion is completed with Claude Code, save a written summary to `.claude/planning-sessions/<date>-<topic>.md` in this repo. This keeps a running record of design decisions and the reasoning behind them alongside the code.

Longer-form decisions should also be logged in `$OBSIDIAN_VAULT/Projects/Tavern Log/Decisions.md`.

---

## Monorepo Structure

```
tavern-log/
  apps/
    web/          — Next.js 14 (App Router, TypeScript, Tailwind)
    api/          — Fastify (TypeScript)
  docker-compose.yml   — local Postgres 16 on port 5432
  package.json         — npm workspaces root
  CLAUDE.md
```

### Key rules

- `apps/api` owns **all database access** — Prisma lives here only
- `apps/web` is a pure frontend — fetches all data from the Fastify API via `API_URL`
- Never add Prisma or database logic to `apps/web` unless explicitly instructed

---

## Tech Stack

### `apps/web`

- **Framework:** Next.js 14, App Router, React Server Components
- **Styling:** Tailwind CSS with CSS custom properties for per-character theming
- **Data fetching:** TanStack Query v5 — RSC prefetch + HydrationBoundary for public pages, `useMutation` / `useQuery` for admin
- **Animations:** Framer Motion — per-character page transition variants
- **Rich text:** Tiptap (admin editor), DOMPurify (render sanitisation)

### `apps/api`

- **Framework:** Fastify (TypeScript)
- **Database:** Prisma ORM → Postgres (Docker locally, Neon in production)
- **Auth:** `@fastify/jwt` + `@fastify/cookie` + `@fastify/csrf-protection`
- **Validation:** Fastify built-in JSON schema (ajv)
- **File storage:** AWS S3 presigned PUT URLs via `@aws-sdk/client-s3`
- **CORS:** `@fastify/cors` — allows `localhost:3000` (dev) and `tavernlog.kasparas.dev` (production)

---

## Running Locally

```bash
# Start Postgres
docker compose up -d

# Install all dependencies (run from root)
npm install

# Start both apps concurrently (run from root)
npm run dev
# apps/web → http://localhost:3000
# apps/api  → http://localhost:3001

# Database (run from apps/api)
npx prisma migrate dev
npx prisma db seed
npx prisma studio
```

---

## Environment Variables

### `apps/web/.env.local`

```
API_URL=http://localhost:3001
```

### `apps/api/.env`

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tavernlog
DATABASE_URL_UNPOOLED=postgresql://postgres:postgres@localhost:5432/tavernlog
JWT_SECRET=<openssl rand -base64 32>
AWS_REGION=eu-south-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=tavernlog-upload
```

---

## Key Patterns

### Data fetching — RSC prefetch + HydrationBoundary

Public pages fetch on the server and seed the client cache. Client components find data already present — no loading flash.

```tsx
// Server Component (RSC)
export default async function CharacterPage({ params }) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["character", params.slug],
    queryFn: () => fetch(`${process.env.API_URL}/characters/${params.slug}`).then((r) => r.json()),
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CharacterProfile slug={params.slug} />
    </HydrationBoundary>
  );
}

// Client Component
("use client");
export function CharacterProfile({ slug }) {
  const { data } = useQuery({
    queryKey: ["character", slug],
    queryFn: () => fetch(`/api/characters/${slug}`).then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}
```

### Auth — Fastify JWT + httpOnly cookie

- `POST /auth/login` validates credentials (bcrypt), issues JWT as httpOnly cookie
- `POST /auth/logout` clears the cookie
- Protected Fastify routes use an `authenticate` prehandler that verifies the JWT
- Next.js `middleware.ts` checks for the cookie and redirects unauthenticated requests away from `/admin/*`

### Admin mutations — TanStack Query

```tsx
const deleteMutation = useMutation({
  mutationFn: (id: string) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/stories/${id}`, { method: "DELETE" }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["stories", characterId] }),
});
```

### Per-character theming — CSS variables

Tailwind is configured to use CSS custom properties. The character layout injects theme values via `style` prop — Tailwind classes stay static, only variable values change at runtime.

```tsx
// Character layout
<div
  style={
    {
      "--theme-bg": character.theme.bgColor ?? "#1a1a2e",
      "--theme-text": character.theme.textColor ?? "#e0e0e0",
      "--theme-accent": character.theme.accentColor ?? "#7c3aed",
    } as React.CSSProperties
  }
>
  {children}
</div>
```

```js
// tailwind.config.js — reference the variables
colors: {
  'theme-bg':     'var(--theme-bg)',
  'theme-text':   'var(--theme-text)',
  'theme-accent': 'var(--theme-accent)',
}
```

Phase 1: 3–5 preset themes selectable in admin. No free colour picker until Phase 2.

### File uploads — presigned S3 URLs

1. Admin client calls `POST /admin/upload/presign` with `{ filename, contentType }`
2. Fastify returns a presigned PUT URL + final object URL
3. Client PUTs the file directly to S3 — neither server handles the binary
4. Client saves the returned object URL to the form

### Fastify route structure

```
apps/api/src/
  index.ts          — server entry, listens on 0.0.0.0:3001
  app.ts            — app factory, registers plugins and routes
  plugins/
    auth.ts         — JWT, cookie, CSRF setup; exports authenticate prehandler
    cors.ts         — CORS config
  routes/
    characters.ts   — public read routes
    auth.ts         — login / logout
    admin/
      characters.ts — CRUD
      stories.ts    — CRUD + draft/publish
      voice-lines.ts
      artworks.ts
      timeline.ts
      upload.ts     — presign endpoint
  lib/
    prisma.ts       — Prisma client singleton
    s3.ts           — S3 client + presign helper
  utils/
    slug.ts         — toSlug helper (shared by characters and stories routes)
```

---

## Prisma Schema Location

`apps/api/prisma/schema.prisma`

Key model notes:

- `Character.theme` is `Json @default("{}")` — stores `{ bgColor, textColor, accentColor, bgPattern, transition }`
- `Character.slug` is generated on create, never regenerated — changing it breaks URLs
- `Character.createdById` links each character to the `User` who created it — used to enforce ownership on all admin routes
- `Story.isDraft` defaults to `true` — never expose draft stories on public routes
- `VoiceLine`, `Artwork`, `TimelineEvent` all carry an `order Int` for manual ordering

---

## Deployment

| App          | Platform                   | Domain                       |
| ------------ | -------------------------- | ---------------------------- |
| `apps/web`   | Vercel                     | `tavernlog.kasparas.dev`     |
| `apps/api`   | Koyeb                      | `api.tavernlog.kasparas.dev` |
| Database     | Neon (serverless Postgres) | —                            |
| File storage | AWS S3 (`eu-south-2`)      | —                            |

---

## Testing

Both apps use **Vitest**. No database needed — tests run fully offline.

**Before writing any tests, read `.claude/TESTING_RESOURCES.md`** — it lists all available fixtures, utilities, and mocks for both apps.

**After adding any new fixture, shared mock, or test utility, update `.claude/TESTING_RESOURCES.md`** to reflect the addition.

### Running tests

```bash
npm test --workspace=apps/api    # API route tests
npm test --workspace=apps/web    # web component tests
```

### `apps/api` — route integration tests

- Uses Fastify `app.inject()` — no real server or network
- Prisma is mocked via `vi.mock('../lib/prisma')` — no database connection
- Fixtures in `src/test/fixtures.ts` are typed with `Prisma.CharacterGetPayload<...>` to match exact route query shapes — no `as any`

### `apps/web` — component tests

- jsdom environment, React Testing Library
- `next/link` and `next/image` have shared mocks in `apps/web/__mocks__/` — use `vi.mock('next/link')` with no factory
- `src/test/utils.tsx` exports `renderWithQuery(ui, data)` for components that use TanStack Query
- Fixtures in `src/test/fixtures.ts` are typed with `Character` / `StoryEntry` from `@/lib/types`

### Shared fixture data

Both apps have their own `src/test/fixtures.ts` built from Mira Ashveil's seed data (`apps/api/prisma/seed.ts`). They are separate files with different type systems (Prisma types vs API response types) — **keep them in sync when the seed changes**.

### No `as any` in tests

Fixture types must be derived from the actual types used by the code under test (`Prisma.CharacterGetPayload<...>` for API, `Character`/`StoryEntry` for web). Never cast fixture data with `as any`.

---

## Current Milestone

**Milestone 3 — Auth & Admin Interface.** See `$OBSIDIAN_VAULT/Projects/Tavern Log/Sprint.md` for active tasks.

Goal: Fastify JWT auth, httpOnly cookie session, CSRF protection, Next.js middleware for route protection, full admin CRUD for all content types, Tiptap rich text editor, site-wide header, and testing coverage for all new routes and components.
