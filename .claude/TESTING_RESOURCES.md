# Testing Resources

Always read this file before writing tests. It lists every shared fixture, utility, and mock available in the project so you don't duplicate them.

---

## `apps/api`

### Pattern
Route integration tests use Fastify `app.inject()` — no real server or network. Prisma is mocked at the module level via `vi.mock('../lib/prisma')`.

```ts
vi.mock('../lib/prisma', () => ({
  prisma: {
    character: { findMany: vi.fn(), findFirst: vi.fn() },
    story: { findFirst: vi.fn() },
  },
}))
import { prisma } from '../lib/prisma'

// In each test:
vi.mocked(prisma.character.findMany).mockResolvedValue([miraCharacterListItem])
const app = buildApp()
const res = await app.inject({ method: 'GET', url: '/characters' })
```

### Fixtures — `src/test/fixtures.ts`

| Export | Type | Description |
|---|---|---|
| `miraCharacterListItem` | `Prisma.CharacterGetPayload<{ include: { tags } }>` | Mira — shape returned by `GET /characters` (findMany) |
| `miraCharacterDetail` | `Prisma.CharacterGetPayload<{ include: { tags, stories, voiceLines, artworks, timeline } }>` | Mira — shape returned by `GET /characters/:slug` |
| `miraStory` | `Story` | Mira's published story (`isDraft: false`), slug `the-last-spell` |
| `naraCharacterListItem` | `Prisma.CharacterGetPayload<{ include: { tags } }>` | Nara — Blades in the Dark, tags `scoundrel/Blades in the Dark/active` |
| `naraCharacterDetail` | `Prisma.CharacterGetPayload<{ include: { tags, stories, voiceLines, artworks, timeline } }>` | Nara — full detail |
| `naraStory` | `Story` | Nara's published story (`isDraft: false`), slug `the-crows-foot-job` |

All fixtures are typed with exact Prisma payload types — **no `as any`**.

---

## `apps/web`

### Pattern
Component tests use React Testing Library in a jsdom environment. See `vitest.config.ts` for setup.

### Test utility — `src/test/utils.tsx`

`renderWithQuery(ui, data)` — renders a component wrapped in `QueryClientProvider` with pre-populated cache. Use this for any component that calls `useQuery`.

```tsx
import { renderWithQuery } from '@/test/utils'

renderWithQuery(<CharacterGrid />, [
  [['characters'], [mockCharacterListItem]],
])
```

- `data` is `Array<[QueryKey, unknown]>` — each tuple maps a query key to its cached value.
- The QueryClient is created with `staleTime: Infinity, retry: false` so pre-populated data is never refetched.
- Returns the standard RTL `render()` result (includes `screen`, etc. from `@testing-library/react`).

### Automatic mocks — `__mocks__/`

These live in `apps/web/__mocks__/` (adjacent to `node_modules`). Call `vi.mock('next/link')` or `vi.mock('next/image')` **with no factory** and Vitest uses these files automatically.

| `vi.mock(...)` call | What it provides |
|---|---|
| `vi.mock('next/link')` | Plain `<a href={href} className={className}>` — forwards `href` and `className` |
| `vi.mock('next/image')` | Plain `<img alt={alt}>` |

### Manual mock — `next/navigation`

`next/navigation` (e.g. `usePathname`) has no `__mocks__` file because tests need to control its return value per test. Use this pattern:

```ts
const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

// In each test:
mockUsePathname.mockReturnValue('/characters/mira-ashveil')
```

### Fixtures — `src/test/fixtures.ts`

| Export | Type | Description |
|---|---|---|
| `mockCharacter` | `Character` | Mira — full detail, use for `['character', 'mira-ashveil']` cache |
| `mockCharacterListItem` | `{ id, slug, name, system, thumbnailUrl, tags }` | Mira — slim list item, use for `['characters']` cache |
| `mockStory` | `StoryEntry` | Mira's published story (`isDraft: false`), slug `the-last-spell` |
| `naraCharacter` | `Character` | Nara Solis — Blades in the Dark, full detail, use for `['character', 'nara-solis']` cache |
| `naraCharacterListItem` | `{ id, slug, name, system, thumbnailUrl, tags }` | Nara — slim list item; different system/tags from Mira, use for filter tests |

All fixtures typed with `Character` / `StoryEntry` from `@/lib/types` — **no `as any`**.

### Special mocking patterns

**`HTMLMediaElement.play/pause`** — not implemented in jsdom. Stub in `beforeAll`:
```ts
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined)
  window.HTMLMediaElement.prototype.pause = vi.fn()
})
```

**Child component isolation** — mock leaf components that cause media/canvas issues (e.g. mock `./AudioPlayer` in `VoiceLinesList.test.tsx`):
```ts
vi.mock('./AudioPlayer', () => ({
  AudioPlayer: ({ audioUrl }: { audioUrl: string }) => (
    <div data-testid="audio-player" data-url={audioUrl} />
  ),
}))
```

**Lightbox isolation** — mock `./Lightbox` in `GalleryGrid.test.tsx` to test open/close state without full Lightbox rendering:
```ts
vi.mock('./Lightbox', () => ({
  Lightbox: ({ index, artworks, onClose }) => (
    <div data-testid="lightbox" data-index={index}>
      <button onClick={onClose} aria-label="Close" />
      <span>{artworks[index]?.title}</span>
    </div>
  ),
}))
```

> **Keep in sync:** Both apps' `fixtures.ts` files are built from `apps/api/prisma/seed.ts`. Update both when the seed changes.
