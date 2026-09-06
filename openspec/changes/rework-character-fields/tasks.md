## 1. Schema & Migration (API)

- [x] 1.1 Update `apps/api/prisma/schema.prisma` — remove `system`, `campaign`, `status` and the `CharacterStatus` enum; add `tagline String?`, `pronouns String?`, `designedBy String?`
- [x] 1.2 Generate migration (`npx prisma migrate dev`) and edit its SQL to backfill tags first: insert `system` and `campaign` values as `CharacterTag` rows, skipping NULL/empty and duplicates (respect `@@unique([characterId, tag])`), then drop the columns and enum type
- [x] 1.3 Run migration against local Docker Postgres and verify with a seeded character: system/campaign values appear as tags, columns gone, no duplicates
- [x] 1.4 Update `apps/api/prisma/seed.ts` — Mira/Nara carry tags instead of system/campaign/status, plus sample `tagline`/`pronouns` values; re-seed dev DB

## 2. API Routes & Tests

- [x] 2.1 Create `src/routes/tags.ts` — `GET /tags?q=`: public, `groupBy` on `characterTag` scoped to public characters, case-insensitive `startsWith`, `_count` desc + tag asc tiebreak, `take: 10`; register in route index
- [x] 2.2 Update `src/routes/characters.ts` — remove `?system=` filter handling and dropped fields from selects/responses
- [x] 2.3 Update `src/routes/admin/characters.ts` — JSON schemas: drop `system`/`campaign`/`status` (remove `system` from required), add optional `tagline` (maxLength 140), `pronouns`, `designedBy`
- [x] 2.4 Update `src/test/fixtures.ts` — reworked character shape, in sync with new seed data
- [x] 2.5 Add `src/routes/tags.test.ts` — prefix filter, count ordering + alphabetical tiebreak, take 10, public-characters-only scoping, empty/no-match cases
- [x] 2.6 Update affected route tests — `characters.test.ts` (remove `?system=` test), `admin/characters.test.ts` (create with name only succeeds; new fields persist; removed fields absent from responses)

## 3. Web Types & Display Components

- [x] 3.1 Update `apps/web/src/lib/types.ts` — remove `system`/`campaign`/`status`, add `tagline?`/`pronouns?`/`designedBy?`
- [x] 3.2 Update `src/test/fixtures.ts` — mirror the API fixture changes (keep-in-sync rule)
- [x] 3.3 Update `CharacterCard.tsx` — subtext: tagline → first 3 tags → omitted; remove system; update card tests (overlay shows tagline/tags, no system label)
- [x] 3.4 Update `CharacterGrid.tsx` — remove system filter axis, tags-only filtering; update grid tests
- [x] 3.5 Update character `layout.tsx` header — tagline, falling back to pronouns; update `[slug]/page.tsx` OG fallback to `bio ?? tagline ?? name`
- [x] 3.6 Update `CharacterOverview.tsx` — remove status block; show pronouns/designedBy (and tagline) where set; update tests
- [x] 3.7 Update admin `CharacterList.tsx` — replace system column with tagline or tags; update list tests

## 4. Tag Autocomplete UI

- [x] 4.1 Build suggestion fetching — debounced (~250ms) call to `GET /tags?q=` as tag input value changes; skip fetch for empty input
- [x] 4.2 Extend the tag input in `CharacterForm.tsx` with the dropdown — suggestion listbox, click/Enter to add, arrow-key highlight, Escape/blur/empty close; exclude already-added tags case-insensitively; combobox aria wiring (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="option"` + ids)
- [x] 4.3 Add component tests — suggestions narrow on typing, Enter/click adds chip, duplicates excluded, keyboard nav + Escape, debounce limits requests, blur closes without adding

## 5. Admin Form Field Rework

- [x] 5.1 Update `useCharacterForm.ts` — replace `system`/`campaign`/`status` state with `tagline`/`pronouns`/`designedBy`; submit payload carries only existing fields
- [x] 5.2 Update `CharacterForm.tsx` — remove system/campaign/status inputs; add tagline (maxLength 140), pronouns, designedBy inputs; update edit page initial values
- [x] 5.3 Update `CharacterForm.test.tsx` — submission asserts new fields, no removed fields; removed-field inputs absent

## 6. Verification

- [ ] 6.1 Run `npm test --workspace=apps/api` and `npm test --workspace=apps/web` — all green
- [ ] 6.2 Run lint + typecheck for both apps
- [ ] 6.3 Manual smoke: create character with name only → add tags via autocomplete → save → verify card subtext, header, landing tag filter on public pages
