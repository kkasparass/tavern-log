## Context

The landing page renders every character through a single hardcoded `CharacterCard` (portrait image, gradient overlay, bottom-anchored text). Card data flows from `GET /characters` → `CharacterGrid` → cards, with the raw `theme` JSON on each character. Hover previews the character's transition via `TransitionProvider` (`hoverPreview`/`clearHoverPreview`), and navigation goes through `TransitionLink`.

The admin character edit form already has the `ThemeSection` pattern (PresetSelector + ColorControls + AppearanceControls): a controlled `value/onChange` section, theme state initialised via `resolveTheme()` in `useCharacterForm`, submitted inside the `theme` blob on POST/PUT. Preset/theme machinery is pinned by tests (`ThemeSection.test.tsx`, `PresetSelector.test.tsx`, `AppearanceControls.test.tsx`).

Storage constraint verified in code: `Character.theme` is open JSONB; the public characters route returns it verbatim; admin POST/PUT pass `theme` through unchanged. Adding a key to that JSON requires no API or migration work.

Full workshop record: `$OBSIDIAN_VAULT/Projects/Tavern Log/Features/Character Card Templates.md`; rationale: `Decisions.md` D20.

## Goals / Non-Goals

**Goals:**

- Per-character card template choice with per-template settings, rendered on the landing page
- Registry-driven extensibility: a future template is one registry entry + two components
- Admin picker with an inline live card preview exercising the real card + hover code path
- Backward compatibility: no `theme.card` / legacy rows / bad values → current portrait card, default settings

**Non-Goals:**

- Any API or schema change (`theme` stays an opaque blob to `apps/api`)
- Per-template hover animations (theme-driven hover preview stays uniform)
- Thumbnail-preview template picker (BL-7, future polish)
- Global site-wide card layout mode; masonry/mixed-height grid optimisation

## Decisions

### D1 — Storage: discriminated `theme.card` object inside the existing theme JSON

`theme.card = { template: CardTemplateId; settings: Record<string, unknown> }`.

- *Why not a top-level `cardTemplate` column:* cleaner conceptually but requires a Prisma migration + API schema touches, converting a web-only feature into web+api for conceptual purity alone. The open JSONB already carries the theme shape the same way.
- *Why a nested discriminated object over flat keys (`cardTemplate`, `cardSettings`):* one atomic unit to validate/resolve, and settings stay template-scoped instead of leaking into the theme namespace.

### D2 — Resolution beside `ThemeConfig`, not inside it

`resolveCard(rawTheme)` reads the same raw JSON the card already receives; `ThemeConfig` gains no field.

- *Why not extend `ThemeConfig` (rejected Option A):* `PresetSelector.findMatchingPreset()` compares all `ThemeConfig` fields — a `card` field false-positives every character as "Custom" and lets preset fills stomp card choices; `ThemeConfig` is also the currency of the transition system (`previewTheme`, `TransitionLink`, admin Preview) where card data is noise. Separation means presets/theme/transition machinery is provably untouched.
- Cost: `useCharacterForm` holds a second small state slice (`card`) merged into the submitted `theme` blob (`{ ...theme, card }`). Covered by form payload tests.

### D3 — Settings sanitisation: merge over per-template defaults with type-checking

`settings = { ...entry.defaultSettings, ...sanitize(raw.card.settings) }` where `sanitize` drops unknown keys and values whose type doesn't match the declared default's type.

- *Why not pass-through:* junk keys would accumulate in the JSON forever and every component would need defensive access at point of use.
- *Why not strict per-template schemas (API-style JSON schema validation):* overkill for a single-user Phase 1 admin where the form is the only writer; structural type-checking against defaults survives template evolution without migrations.

### D4 — Registry pattern (mirrors `decorations.ts`)

`Record<CardTemplateId, { label, CardComponent, SettingsControls, defaultSettings }>` in `lib/themes/cardTemplates.ts`, with `resolveCard<T extends CardTemplateId>(template, raw): { template: T; settings: SettingsOf<T> }` generic narrowing so card components receive fully-typed props without casts (matches the no-`as any` fixture bar).

v1 entries:

| Id | Presentation | Settings |
|---|---|---|
| `portrait` | Current card extracted as-is (2:3 image, gradient overlay, bottom-anchored text, hover zoom) | `{}` |
| `banner` | Horizontal: thumbnail left, text block right | `{ imageAlignment: "left" \| "right" }` |
| `compact` | Dense row: avatar circle + name + tagline | `{ showTags: boolean }` |
| `polaroid` | Framed/tilted decorative variant | `{ rotation: number, frameColor: string }` |

Subtext logic (`tagline ?? first 3 tags`, omit when both empty) is shared — extracted once, used by all card components.

### D5 — `CharacterCard` becomes a dispatcher

`CharacterCard` resolves theme (`resolveTheme`) and card (`resolveCard`) from the raw JSON, looks up the registry, and renders the template component; unknown ids fall back to `portrait`. The existing hover wiring (`onMouseEnter` → `hoverPreview(resolvedTheme)`, `onMouseLeave` → `clearHoverPreview`) and `TransitionLink` navigation live in the dispatcher so every template inherits them — templates render only their presentation.

### D6 — Admin: `CardTemplateSection` sibling to `ThemeSection`

Controlled `value/onChange` section, own `card` state in `useCharacterForm` (initialised via `resolveCard(defaultValues?.theme ?? {})`). Changing template resets settings to that template's defaults and swaps in its `SettingsControls`. The inline live preview renders the actual `CharacterCard` dispatcher with the character's current form data, so hover effects work (the section is inside `TransitionProvider`). Dropdown select for v1; thumbnail-preview picker is BL-7.

## Risks / Trade-offs

- [Two state slices (`theme`, `card`) can drift on submit] → single merge point in `submitForm` (`{ ...theme, card }`), pinned by a form payload test; card edits assert they don't set `preset: "custom"`
- [`resolveCard` sanitisation silently discards valid-but-new settings after a template evolves] → defaults always render a coherent card; sanitisation only matches against declared defaults, so re-saving from the admin form restores new keys
- [Mixed card heights (compact vs portrait) make the single-column grid feel uneven] → accepted for v1; masonry layout is an explicit non-goal, revisit after real-world use
- [Polaroid `rotation` could overlap neighbouring cards] → rotation clamped to a small range (e.g. ±6°) and card container keeps layout bounds; visual overflow allowed only inside the card's own spacing
- [Inline admin preview renders hover overlays in the edit page] → preview uses the same `TransitionProvider` phases as the landing page; verify via component test that mouseleave clears preview state

## Migration Plan

No migration. Existing rows lack `theme.card` → resolve to `{ template: "portrait", settings: {} }` (current behaviour). Rollback = revert the web deploy; stored `theme.card` data is inert for the old code. Deployment is the standard web-only Vercel push (API image unaffected).

## Open Questions

None — all workshop questions settled 2026-09-07 (see spec header + D20).
