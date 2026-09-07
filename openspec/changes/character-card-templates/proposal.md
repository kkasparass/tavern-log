## Why

Every landing-page character card uses one hardcoded presentation. Characters have distinct personalities and art styles — a single portrait card can't showcase them all. BL-2 (graduated 2026-09-07, spec: `$OBSIDIAN_VAULT/Projects/Tavern Log/Features/Character Card Templates`) calls for per-character card templates, each with its own settings, previewable from the admin edit page with working hover effects.

## What Changes

- Add four card presentation templates: `portrait` (current card, becomes the default), `banner` (horizontal thumbnail + text), `compact` (minimal row), and `polaroid` (framed/tilted)
- Store the choice as a discriminated object inside the existing open `theme` JSONB: `theme.card = { template, settings }` — **no API or migration changes** (verified: public route returns raw `theme`, admin POST/PUT pass it through)
- Introduce a card template registry (`Record<CardTemplateId, { label, CardComponent, SettingsControls, defaultSettings }>`) mirroring the decorations registry pattern, so future templates are pure additions
- Resolve card state **beside** `ThemeConfig` (D20): new `resolveCard(rawTheme)` with per-template typed settings sanitised against defaults; `resolveTheme()`/`ThemeConfig`, presets, and the transition system are untouched
- Add a `CardTemplateSection` to the admin character edit form — sibling to `ThemeSection` — with a template dropdown, per-template settings controls, and an inline live card preview with working hover effects
- All templates keep the existing theme-driven hover preview and `TransitionLink` navigation; card edits never touch `preset: "custom"` and preset fills never stomp card choices

## Capabilities

### New Capabilities

- `character-card-templates`: per-character card template selection and resolution — `theme.card` storage shape, template registry, per-template settings with defaults-based sanitisation, portrait fallback for missing/legacy/invalid data, and the admin template picker with inline live preview

### Modified Capabilities

- `character-showcase-card`: card rendering becomes template-driven — portrait-specific presentation requirements (full-bleed image, gradient text overlay, zoom-on-hover styling) are scoped to the default `portrait` template; navigation and theme hover-preview requirements generalise to all templates

## Impact

- **`apps/web` only.** Zero API changes; no Prisma migration; existing API tests untouched.
  - `lib/themes/types.ts` — `CardTemplateId`, per-template settings types, `cardLabel()`
  - `lib/themes/cardTemplates.ts` (new) — registry + `resolveCard()`
  - `components/character/CharacterCard.tsx` — becomes a dispatcher; new `cards/*` template components; shared subtext extraction
  - `components/admin/CardTemplateSection.tsx` (new), `CharacterForm.tsx`, `useCharacterForm.ts` — new separate `card` state slice merged into the submitted `theme` blob
  - `src/test/fixtures.ts` + new component tests; existing suites stay green
- Dependencies: none new (dropdown/select and preview reuse existing primitives)
- Decisions: D20 in the vault decision log; feature spec in `$OBSIDIAN_VAULT/Projects/Tavern Log/Features/Character Card Templates.md`
