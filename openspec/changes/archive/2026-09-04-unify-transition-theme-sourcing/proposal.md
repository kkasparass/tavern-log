# Proposal: Unify transition theme sourcing in `previewTheme`

## Why

The transition overlay takes its colours from a single hover-only channel (`hoveredCharacter`), but two of the three activation paths never touch it: the admin theme Preview button plays transitions in `DEFAULT_THEME` colours instead of the user's selected theme (backlog BL-1), and tapping a character card on a touch device skips hover entirely, so navigation covers the screen in default colours instead of the character's theme.

## What Changes

- Replace the `hoveredCharacter` state in `TransitionProvider` with a single `previewTheme: ThemeConfig | null` — the one colour source for `CharacterThemeOverlay`, fed by every activation path
- **BREAKING** (internal API only): `preview(transitionId)` → `preview(theme: ThemeConfig)`; `navigate(href, transitionId)` → `navigate(href, theme: ThemeConfig)`; `setHoveredCharacter`/`clearHoveredCharacter` → `hoverPreview(theme)`/`clearHoverPreview()`
- Derive `activeTransition` from `previewTheme?.transition ?? null` instead of storing it as separate state — removes a state-sync risk
- `TransitionLink` takes a `theme` prop instead of `transitionId`; the null-transition case (route immediately) moves inside `navigate`
- `CharacterThemeOverlay` reads `previewTheme ?? DEFAULT_THEME`; `DEFAULT_THEME` becomes a last-resort fallback only
- Touch-device fix: navigation carries the theme at click time, so covering works without a prior hover
- Admin theme Preview button plays transitions in the live form colours

## Capabilities

### New Capabilities
- `character-transition`: Theme sourcing and activation for the character transition overlay system — how the overlay resolves which theme (colours + transition id) to render, across hover preview, navigation, and admin preview activation paths.

### Modified Capabilities

- None. `character-showcase-card` and `page-layout` requirements are unaffected — the card's navigation behaviour ("using the character's transition animation") is preserved, only the internal theme-sourcing contract changes.

## Impact

- **Code** (`apps/web/src/components/transitions/`): `TransitionProvider.tsx` (state rework), `CharacterThemeOverlay.tsx` (1-line colour source), `TransitionLink.tsx` (prop change), plus call sites `CharacterCard.tsx` and `AppearanceControls.tsx` (Preview button)
- **Tests**: `TransitionProvider.test.tsx`, `CharacterThemeOverlay.test.tsx`, `TransitionLink.test.tsx`, `CharacterCard` tests, `AppearanceControls.test.tsx` — callback renames, new assertions that all three activation paths set `previewTheme`, new touch-device-path test
- **Consumers**: `ThemeSection`/future admin theme work calls `preview(theme)`; BL-3 (card templates) will extend the same pattern
- **No API/database changes** — purely client-side in `apps/web`
