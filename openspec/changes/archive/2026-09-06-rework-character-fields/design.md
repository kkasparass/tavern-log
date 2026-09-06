## Context

The Character model (`apps/api/prisma/schema.prisma`) currently has `system String` (required), `campaign String?`, and `status CharacterStatus` (enum `ACTIVE/RETIRED/DECEASED`). `system` is the card subtext, profile header subtext, OG description fallback, landing-page filter axis, and a required create field in the admin JSON schema. Tags already exist as a `CharacterTag` join table (`@@unique([characterId, tag])`) and are the second landing filter axis (`?tag=`).

The admin tag input is inline in `CharacterForm.tsx` (chips, Enter-to-add, `tagInput` state in `useCharacterForm.ts`). Both apps have separate `src/test/fixtures.ts` that must stay in sync (CLAUDE.md rule). Tests run fully offline — Prisma is mocked via `vi.mock`, so migration logic is not covered by tests and must be verified against the real dev DB.

Workshop decisions and rationale live in the vault (`Features/Character Fields Rework.md`, `Decisions.md` D19). This design covers the technical how.

## Goals / Non-Goals

**Goals:**
- Character model works for any OC type; `name` is the only required field
- Tags become the single filter/discovery axis, kept consistent via autocomplete
- Lossless migration of existing `system`/`campaign` data into tags
- Tagline-driven subtext across card, header, and OG metadata

**Non-Goals:**
- No universe/species/age structured fields (tags + bio carry them)
- No card template system (BL-2) — this change only swaps the card subtext source
- No user-defined custom attribute fields (JSON bag rejected, D19)
- No tag rename/delete/merge admin tooling (fragmentation handled by autocomplete for now)

## Decisions

### D1 — Field removal vs renaming `system` → `universe`
`universe` was considered (ArtFight's copyright concept) but rejected in the workshop: a dedicated field for what a tag already expresses adds schema churn and forces a facet. Tags + `tagline` cover the same needs without mandating structure. The three added fields (`tagline`, `pronouns`, `designedBy`) are all optional strings — no enum, no required semantics, minimal schema risk.

### D2 — `tagline` naming and limit
Chosen over `blurb` (casual) and `shortDescription` (verbose) in the workshop. Max length ~140 chars enforced loosely in the admin JSON schema (`maxLength`) and left unenforced in the DB — this is presentational subtext, not structured data. No trimming/normalisation beyond `.trim()`.

### D3 — Migration strategy: backfill in SQL inside the migration
The Prisma migration does backfill-then-drop in a single `migrate dev` generated migration with custom SQL:
1. `INSERT INTO "CharacterTag" (id, "characterId", tag)` — select `system` values (and `campaign` values) with `ON CONFLICT DO NOTHING` semantics via the existing `@@unique([characterId, tag])` constraint; skip NULL/empty strings; lowercase-free (preserve original casing, matching how tags are displayed elsewhere).
2. Drop `system`, `campaign`, `status` columns and the `CharacterStatus` enum type.

Rollback is impractical (columns are dropped), but the operation is lossless by construction: every dropped value exists as a tag afterward. Single-user dataset makes risk negligible; run against dev DB first, then `migrate deploy` on Neon in CI as usual.

### D4 — `GET /tags` as a public route, scoped to public characters
New route registered alongside public character routes: `GET /tags?q=<prefix>` → `{ tags: [{ tag, count }] }`. Implementation: `prisma.characterTag.groupBy({ by: ['tag'], where: { character: { isPublic: true }, tag: { startsWith: q, mode: 'insensitive' } }, _count: { tag: true }, orderBy: { _count: { tag: 'desc' } }, take: 10 })`.

Scoping to public characters costs nothing now and prevents Phase 2 multi-user from leaking private-character tags through the suggestion pool. Prefix match uses `startsWith` (not `contains`) so suggestions narrow as the user types. A dedicated route (rather than piggybacking on `/characters`) keeps the concern separate and cheap to cache later.

### D5 — Autocomplete UI: hand-rolled combobox extending the existing tag input
The tag input already exists (chips + Enter-to-add, `tagInput` state in `useCharacterForm`). Rather than swapping to React Aria's ComboBox wholesale (would replace the working chip UX), the existing input gains: debounced (~250ms) fetch on typing, dropdown listbox of suggestions, `role="combobox"` + `aria-expanded`/`aria-activedescendant` wiring, arrow-key navigation, Enter/click to add, Escape to dismiss, suggestions exclude already-added tags (case-insensitive), dropdown closes when input empties or loses focus. Accessibility bar matches D13's rationale (admin is user-facing); a full React Aria ComboBox migration can come later if the hand-rolled version accumulates edge cases.

### D6 — Card subtext fallback: tagline → first 3 tags → nothing
`CharacterCard` renders `tagline` if present; otherwise the first 3 tags; otherwise no subtext line. The 3-cap prevents tall tag stacks from breaking the overlay layout. BL-2 will replace this fixed behaviour with per-template selection, so the fallback is intentionally simple.

### D7 — API response shape change handled as breaking
`GET /characters` and `GET /characters/:slug` responses drop `system`/`campaign`/`status` and gain `tagline`/`pronouns`/`designedBy`. Frontend is deployed from the same repo/CI cadence as the API, and the web app is the only consumer — the breaking window is a single deploy. Both apps' fixtures change in the same commit set, keeping the keep-in-sync rule intact.

## Risks / Trade-offs

- [Migration drops columns irreversibly] → Backfill runs in the same migration before the drop; verify backfilled tags on dev DB before deploying. Dataset is small and single-user.
- [Tag suggestions from public characters only] → A character's own private-era tags may not appear in suggestions; acceptable — the user knows their own tags.
- [Landing filter loses the system dropdown] → All system values return as tags post-migration, so the tag filter covers the same data. Single filter axis is simpler, not weaker.
- [`groupBy` + `_count` ordering] → Prisma orders by count correctly but ties are unordered; deterministic secondary sort by `tag` asc added to keep suggestion order stable.
- [Card subtext regression] → `character-showcase-card` delta spec pins the new overlay behaviour; existing card tests updated alongside fixtures.

## Migration Plan

1. Write the migration with custom SQL (backfill → drop → add new columns).
2. `npx prisma migrate dev` against local Docker Postgres; verify tags appear and columns are gone (`prisma studio` or SQL).
3. Update seed, API routes/schemas, then web types/components (each step keeps tests green).
4. Deploy: CI runs typecheck/lint/tests, then `prisma migrate deploy` against Neon, then container restart — the existing pipeline order already protects the API from running against an unmigrated DB.
5. Rollback strategy: none for the column drop (by design, lossless); a post-migration revert would require re-adding fields as nullable with tags-to-column backfill — not planned.

## Open Questions

None — all workshop questions resolved 2026-09-05 (status → tags, tags-only filter, field set, campaign backfill, `tagline` naming).
