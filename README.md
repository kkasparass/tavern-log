# Tavern Log

A character archive and showcase platform for TTRPG players. Each character gets a dedicated profile page with short stories, voice lines, an art gallery, and a timeline of key moments — all with per-character theming.

**Live site:** [tavernlog.kasparas.dev](https://tavernlog.kasparas.dev)

Anyone can register and upload their own characters. The public landing page displays all characters on the platform, and each user can only edit the characters they own. Phase 2 (planned) adds a social layer built around characters interacting with each other.

![Landing page screenshot](docs/screenshots/landing.png)

---

## Features

### Phase 1 (current)

- Character profile pages with per-character CSS theming (background, text, and accent colours)
- Stories section with a rich text editor (Tiptap) and sanitised render (DOMPurify)
- Voice lines section with an inline audio player
- Art gallery with a fullscreen lightbox
- Character timeline of key events
- Admin interface with full CRUD for all content types
- Draft/publish toggle for stories
- File uploads via presigned S3 URLs — neither server handles the binary payload
- JWT authentication with httpOnly cookie session and CSRF protection
- Client-side character filtering on the landing page
- OpenGraph metadata per character page

### Phase 2 (planned)

- Multi-user public profile pages
- In-character notes — post on a character's profile _as_ one of your own characters
- Stamp scrapbook — leave a transparent PNG stamp on characters you've visited
- Discovery — browse public characters by system, tag, or genre
- Character links — reference other platform characters with a relationship label

---

## Technologies

| Area          | Technology                                                      |
| ------------- | --------------------------------------------------------------- |
| Frontend      | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS     |
| Data fetching | TanStack Query v5 — RSC prefetch + HydrationBoundary            |
| Animations    | Framer Motion                                                   |
| Rich text     | Tiptap (editor), DOMPurify (sanitised render)                   |
| Backend       | Fastify 5, TypeScript                                           |
| Database      | Prisma 5 → PostgreSQL (Neon in production, Docker locally)      |
| Auth          | `@fastify/jwt` + `@fastify/cookie` + `@fastify/csrf-protection` |
| File storage  | AWS S3 (presigned PUT URLs)                                     |
| Testing       | Vitest, React Testing Library                                   |
| Local infra   | Docker Compose (Postgres 16)                                    |

---

## Prerequisites

- **Node.js** v20+
- **npm** (workspaces are used at the repo root)
- **Docker** — for local Postgres via `docker compose`
- **AWS credentials** — only required if working on file upload functionality
- **Neon project** — only required for production deployments

---

## Running the Project

### 1. Clone and install

```bash
git clone https://github.com/your-username/tavern-log.git
cd tavern-log
npm install
```

### 2. Set up environment variables

Copy the example files and fill in values:

```bash
# Frontend
cp apps/web/.env.example apps/web/.env.local

# Backend
cp apps/api/.env.example apps/api/.env
```

`apps/web/.env.local`:

```
API_URL=http://localhost:3001
```

`apps/api/.env`:

```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tavernlog
DATABASE_URL_UNPOOLED=postgresql://postgres:postgres@localhost:5432/tavernlog
JWT_SECRET=<openssl rand -base64 32>
AWS_REGION=eu-south-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
S3_BUCKET_NAME=tavernlog-upload
```

### 3. Start Postgres

```bash
docker compose up -d
```

### 4. Run migrations and seed

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

### 5. Start both apps

From the repo root:

```bash
npm run dev
# apps/web → http://localhost:3000
# apps/api  → http://localhost:3001
```

### Running tests

```bash
npm test --workspace=apps/api   # API route integration tests
npm test --workspace=apps/web   # web component tests
```

---

## Deployment

| Service      | Platform                   | Domain                   |
| ------------ | -------------------------- | ------------------------ |
| Frontend     | Vercel                     | `tavernlog.kasparas.dev` |
| Backend API  | Render                     | —                        |
| Database     | Neon (serverless Postgres) | —                        |
| File storage | AWS S3 (`eu-south-2`)      | —                        |

The GitHub Actions CI pipeline runs typechecks, linting, and `prisma validate` on every pull request. On merge to `master`, it runs `prisma migrate deploy` against the Neon production database and triggers deploys on both Vercel and Render.
