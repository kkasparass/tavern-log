## Why

The character model is too TTRPG-specific for a platform that hosts all kinds of OCs: `system` is required on create, and `campaign` / the `ACTIVE/RETIRED/DECEASED` status enum assume campaign play. Fandom OCs, standalone OCs, and generic personas get meaningless labels on their cards. Tags should be the identity spine instead — but they need autocomplete support to stay consistent enough for filtering (decided in workshop 2026-09-05, see vault `Features/Character Fields Rework` and `Decisions.md` D19).

## What Changes

- **BREAKING** — Remove `system`, `campaign`, and `status` (plus the `CharacterStatus` enum) from the Character model, API responses, forms, and public pages. `GET /characters?system=` filter is removed.
- Make `name` the only required field on character create; everything else optional.
- Add three optional fields: `tagline` (freeform quick-intro line, ~140 char max), `pronouns`, `designedBy`.
- Migration backfills existing `system` and `campaign` values into `CharacterTag` rows before the columns drop.
- New public endpoint `GET /tags?q=` returning distinct tags from public characters (prefix match, ~10 results, usage-count sorted) for autocomplete.
- Tag input in the admin character form gets a debounced suggestion dropdown (click/Enter to add, arrow-key navigation, combobox aria pattern); already-added tags filtered from suggestions.
- Landing page filter becomes tags-only.
- Card overlay subtext switches from `system` to `tagline` (falls back to first ~3 tags when empty); profile header shows tagline/pronouns; OG description fallback becomes `bio ?? tagline ?? name`.
- Seed and fixtures in both apps updated (kept in sync).

## Capabilities

### New Capabilities
- `character-fields`: the character field model — optional-everything-but-name, `tagline`/`pronouns`/`designedBy`, removal of TTRPG-specific fields, and migration of legacy values into tags.
- `tag-system`: tags as the discovery spine — tags-only landing page filtering and the `GET /tags` suggestion endpoint that keeps the tag pool consistent.

### Modified Capabilities
- `character-showcase-card`: card overlay metadata changes from name/system/tags to name/tagline/tags, with tagline falling back to the first tags when empty.

## Impact

- **API** (`apps/api`): Prisma schema + migration (backfill, drop, add); new `GET /tags` route; `routes/characters.ts` (filter + response shape); `routes/admin/characters.ts` (JSON schemas); `seed.ts`; fixtures and route tests.
- **Web** (`apps/web`): `lib/types.ts`; `CharacterForm.tsx` + `useCharacterForm.ts` (field changes + tag autocomplete); `CharacterCard.tsx`; `CharacterGrid.tsx`; character `layout.tsx` (header); `CharacterOverview.tsx`; admin `CharacterList.tsx`; OG metadata; fixtures and component tests.
- **Data:** one-time migration on local dev DB and Neon production (backfill then drop — lossless).
- **No new dependencies.**
