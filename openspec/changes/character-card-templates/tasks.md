## 1. Types and resolution foundation

- [x] 1.1 Add `CardTemplateId` enum (`portrait`, `banner`, `compact`, `polaroid`), per-template settings types (`PortraitSettings = {}`, `BannerSettings`, `CompactSettings`, `PolaroidSettings`), `SettingsOf<T>` mapping, and `cardLabel()` helper in `apps/web/src/lib/themes/types.ts` (effort: 1)
- [x] 1.2 Build `resolveCard()` in `apps/web/src/lib/themes/` — reads `theme.card` from raw JSON, validates template against the registry, sanitises settings (merge over declared defaults, drop unknown keys, type-check against default types), falls back to `{ template: "portrait", settings: {} }` for missing/legacy/invalid input; generic `resolveCard<T>` narrowing to `SettingsOf<T>` without casts (effort: 2)
- [x] 1.3 Test `resolveCard` — defaults on missing/legacy flat shape/garbage input; unknown template id → portrait; unknown settings keys dropped; mistyped values fall back to defaults; typed narrowing compiles without casts (effort: 2)

## 2. Card template registry and components

- [x] 2.1 Create the registry in `apps/web/src/lib/themes/cardTemplates.ts` — `Record<CardTemplateId, { label, CardComponent, SettingsControls, defaultSettings }>` mirroring the `decorations.ts` pattern; extract shared subtext logic (`tagline ?? first 3 tags`, omitted when both empty) for reuse by all card components (effort: 1)
- [x] 2.2 Extract the current card into `PortraitCard.tsx` (2:3 full-bleed image, gradient overlay, bottom-anchored text, hover zoom) with `{}` settings; move existing `CharacterCard.test.tsx` portrait assertions onto it (effort: 2)
- [x] 2.3 Build `BannerCard.tsx` — horizontal thumbnail-left/text-right layout with `imageAlignment: "left" | "right"` mirroring; placeholder handling for missing thumbnails (effort: 2)
- [x] 2.4 Build `CompactCard.tsx` — dense row: avatar circle + name + tagline, tags row toggled by `showTags` (effort: 1)
- [x] 2.5 Build `PolaroidCard.tsx` — framed/tilted decorative variant with `rotation` (clamped to ±6°) and `frameColor` settings (effort: 2)
- [x] 2.6 Test each template component — renders name/tagline/tags/thumbnail per its settings; settings toggles visibly change output (banner mirrors, compact hides tags, polaroid applies rotation/colour) (effort: 3)

## 3. Card dispatcher on the landing page

- [x] 3.1 Refactor `CharacterCard.tsx` into a dispatcher — `resolveTheme(theme)` + `resolveCard(theme)` on the raw JSON, registry lookup, portrait fallback for unknown ids; hover wiring (`hoverPreview`/`clearHoverPreview`) and `TransitionLink` navigation live in the dispatcher so every template inherits them (effort: 2)
- [x] 3.2 Verify `CharacterGrid` single-column layout holds with mixed template heights; adjust card container spacing so polaroid rotation doesn't shift layout (effort: 1)
- [x] 3.3 Test dispatcher — renders the stored template per character; falls back to portrait; `hoverPreview`/`clearHoverPreview` fire with the resolved theme from every template; `TransitionLink` receives correct `href` + theme; existing `CharacterCard.test.tsx` suite stays green (effort: 2)

## 4. Admin template section

- [ ] 4.1 Build `CardTemplateSection.tsx` — controlled `value/onChange` section: template dropdown (registry labels), selected template's `SettingsControls`, and inline live preview rendering the actual `CharacterCard` dispatcher with the character's current data (effort: 3)
- [ ] 4.2 Build per-template `SettingsControls` components — banner alignment toggle, compact show-tags toggle, polaroid rotation + frame colour controls; changing template resets settings to that template's defaults (effort: 2)
- [ ] 4.3 Update `useCharacterForm.ts` — separate `card` state initialised via `resolveCard(defaultValues?.theme ?? {})`; `submitForm` merges into the submitted `theme` blob (`{ ...theme, card }`); card edits never touch theme state or `preset: "custom"` (effort: 1)
- [ ] 4.4 Render `<CardTemplateSection />` in `CharacterForm.tsx` as a sibling to `ThemeSection` (effort: 1)
- [ ] 4.5 Test `CardTemplateSection` — dropdown change swaps settings controls and resets settings; inline preview renders the selected template with character data; hovering the preview triggers and clears the theme hover-preview (effort: 2)
- [ ] 4.6 Update `CharacterForm.test.tsx` / form hook tests — submitted `theme` payload includes `card: { template, settings }`; pre-fill from existing `theme.card`; card changes don't set `preset: "custom"`; preset fills don't stomp card state (effort: 2)

## 5. Fixtures and final verification

- [ ] 5.1 Update `apps/web/src/test/fixtures.ts` — add characters with the new nested theme shape + `theme.card` variants for each template (keep both apps' fixtures in sync where relevant) (effort: 1)
- [ ] 5.2 Confirm zero API changes — API tests untouched and passing; no Prisma migration generated (effort: 0)
- [ ] 5.3 Run full verification — lint, typecheck, and all tests pass in both apps (effort: 1)
