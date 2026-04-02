# Testing Resources

Always read this file before writing tests. It lists every shared fixture, utility, and mock available in the project so you don't duplicate them.

---

## `apps/api`

### Pattern

Route integration tests use Fastify `app.inject()` — no real server or network. Prisma is mocked at the module level via `vi.mock('../lib/prisma')`.

`JWT_SECRET` is set globally in `src/test/setup.ts` (loaded via `setupFiles` in `vitest.config.ts`) — no `beforeAll` needed in individual test files.

```ts
vi.mock("../lib/prisma", () => ({
  prisma: {
    character: { findMany: vi.fn(), findFirst: vi.fn() },
    story: { findFirst: vi.fn() },
  },
}));
import { prisma } from "../lib/prisma";

// In each test:
vi.mocked(prisma.character.findMany).mockResolvedValue([miraCharacterListItem]);
const app = buildApp();
const res = await app.inject({ method: "GET", url: "/characters" });
```

### Auth cookie for admin route tests

Admin routes require a JWT cookie. Use `app.jwt.sign()` directly — no login call needed:

```ts
async function setup() {
  const app = buildApp();
  await app.ready(); // required before calling app.jwt.sign()
  const token = app.jwt.sign({ userId: "user-1", email: "admin@example.com" });
  return { app, authCookie: `token=${token}` };
}

// In each test:
const res = await app.inject({
  method: "GET",
  url: "/admin/characters",
  headers: { cookie: authCookie },
});

// Unauthenticated (expect 401): omit the headers.cookie field
```

Admin test files live in `src/routes/admin/` — mock path is `../../lib/prisma`.

### Mocking bcryptjs

Auth route tests stub `bcrypt.compare` to avoid real hashing:

```ts
vi.mock("bcryptjs");
import bcrypt from "bcryptjs";

// In each test:
vi.mocked(bcrypt.compare).mockResolvedValue(true as never); // valid password
vi.mocked(bcrypt.compare).mockResolvedValue(false as never); // wrong password
```

### Fixtures — `src/test/fixtures.ts`

| Export                  | Type                                                                                         | Description                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `miraCharacterListItem` | `Prisma.CharacterGetPayload<{ include: { tags } }>`                                          | Mira — shape returned by `GET /characters` (findMany)                 |
| `miraCharacterDetail`   | `Prisma.CharacterGetPayload<{ include: { tags, stories, voiceLines, artworks, timeline } }>` | Mira — shape returned by `GET /characters/:slug`                      |
| `miraStory`             | `Story`                                                                                      | Mira's published story (`isDraft: false`), slug `the-last-spell`      |
| `naraCharacterListItem` | `Prisma.CharacterGetPayload<{ include: { tags } }>`                                          | Nara — Blades in the Dark, tags `scoundrel/Blades in the Dark/active` |
| `naraCharacterDetail`   | `Prisma.CharacterGetPayload<{ include: { tags, stories, voiceLines, artworks, timeline } }>` | Nara — full detail                                                    |
| `naraStory`             | `Story`                                                                                      | Nara's published story (`isDraft: false`), slug `the-crows-foot-job`  |

All fixtures are typed with exact Prisma payload types — **no `as any`**.

---

## `apps/web`

### Pattern

Component tests use React Testing Library in a jsdom environment. See `vitest.config.ts` for setup.

### Test utility — `src/test/utils.tsx`

`renderWithQuery(ui, data)` — renders a component wrapped in `QueryClientProvider` with pre-populated cache. Use this for any component that calls `useQuery`.

```tsx
import { renderWithQuery } from "@/test/utils";

renderWithQuery(<CharacterGrid />, [[["characters"], [mockCharacterListItem]]]);
```

- `data` is `Array<[QueryKey, unknown]>` — each tuple maps a query key to its cached value.
- The QueryClient is created with `staleTime: Infinity, retry: false` so pre-populated data is never refetched.
- Returns the standard RTL `render()` result (includes `screen`, etc. from `@testing-library/react`).

### Automatic mocks — `__mocks__/`

These live in `apps/web/__mocks__/` (adjacent to `node_modules`). Call `vi.mock('next/link')` or `vi.mock('next/image')` **with no factory** and Vitest uses these files automatically.

| `vi.mock(...)` call     | What it provides                                                                |
| ----------------------- | ------------------------------------------------------------------------------- |
| `vi.mock('next/link')`  | Plain `<a href={href} className={className}>` — forwards `href` and `className` |
| `vi.mock('next/image')` | Plain `<img alt={alt}>`                                                         |

### Manual mock — `next/navigation`

`next/navigation` (e.g. `usePathname`) has no `__mocks__` file because tests need to control its return value per test. Use this pattern:

```ts
const mockUsePathname = vi.fn();
vi.mock("next/navigation", () => ({
  usePathname: () => mockUsePathname(),
}));

// In each test:
mockUsePathname.mockReturnValue("/characters/mira-ashveil");
```

### Fixtures — `src/test/fixtures.ts`

| Export                  | Type               | Description                                                                               |
| ----------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `mockCharacter`         | `Character`        | Mira — full detail, use for `['character', 'mira-ashveil']` cache                         |
| `mockCharacterListItem` | `CharacterPreview` | Mira — slim list item, use for `['characters']` or `['admin-characters']` cache           |
| `mockStory`             | `StoryEntry`       | Mira's published story (`isDraft: false`), slug `the-last-spell`                          |
| `naraCharacter`         | `Character`        | Nara Solis — Blades in the Dark, full detail, use for `['character', 'nara-solis']` cache |
| `naraCharacterListItem` | `CharacterPreview` | Nara — slim list item; different system/tags from Mira, use for filter tests              |

All fixtures typed with `Character` / `StoryEntry` from `@/lib/types` — **no `as any`**.

### Admin content component tests

The following components have test files covering form submission, list rendering, reorder, and delete:

| Test file                    | Component           | Key pattern                                                                                                              |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `StoryList.test.tsx`         | `StoryList`         | Two stories in defaultProps (one published, one draft with distinct title); tests draft/published badges, toggle, delete |
| `StoryForm.test.tsx`         | `StoryForm`         | Mocks `./RichTextEditor`; tests save with `editingStory` (update) vs null (create)                                       |
| `VoiceLineList.test.tsx`     | `VoiceLineList`     | Three items from `mockCharacter.voiceLines`; tests Move Up/Down disable at edges, onMoveUp/onMoveDown called with index  |
| `VoiceLineForm.test.tsx`     | `VoiceLineForm`     | `audioUrl` + `transcript` required; `context` optional; tests omit-when-empty                                            |
| `ArtworkList.test.tsx`       | `ArtworkList`       | Two items from `mockCharacter.artworks`; tests `Art by ${artistCredit}` render                                           |
| `ArtworkForm.test.tsx`       | `ArtworkForm`       | `imageUrl` required; title/caption/artistCredit optional                                                                 |
| `TimelineEventList.test.tsx` | `TimelineEventList` | Three items from `mockCharacter.timeline`                                                                                |
| `TimelineEventForm.test.tsx` | `TimelineEventForm` | `title` required; description/dateLabel optional                                                                         |

**RichTextEditor mock** — `StoryForm.test.tsx` mocks `./RichTextEditor` to avoid Tiptap in jsdom:

```ts
vi.mock('./RichTextEditor', () => ({
  RichTextEditor: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea data-testid="rich-text-editor" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}))
```

**Tiptap mock** — `RichTextEditor.test.tsx` mocks `@tiptap/react` and `@tiptap/starter-kit`:

```ts
vi.mock('@tiptap/react', () => ({
  useEditor: vi.fn(),
  EditorContent: ({ editor }: { editor: unknown }) =>
    editor ? <div data-testid="editor" /> : null,
}))
vi.mock('@tiptap/starter-kit', () => ({ default: {} }))
```

### Special mocking patterns

**`HTMLMediaElement.play/pause`** — not implemented in jsdom. Stub in `beforeAll`:

```ts
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
});
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
