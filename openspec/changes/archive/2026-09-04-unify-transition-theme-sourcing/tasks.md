# Tasks: Unify transition theme sourcing in `previewTheme`

## 1. Provider refactor

- [x] 1.1 Refactor `TransitionProvider.tsx` — replace `hoveredCharacter` state with `previewTheme: ThemeConfig | null`; derive `activeTransition` as `previewTheme?.transition ?? null`; rename `setHoveredCharacter`/`clearHoveredCharacter` → `hoverPreview`/`clearHoverPreview`; change `navigate(href, transitionId)` → `navigate(href, theme)` (null-transition check inside, routes immediately); change `preview(transitionId)` → `preview(theme)` which also sets `previewTheme`; keep phase machine, callback stability, and `pendingHref` ref unchanged
- [x] 1.2 Update `TransitionProvider.test.tsx` — rename callbacks; assert `previewTheme` set by all three activation paths (hover, navigate, preview); add test that `navigate` sets colours without a prior hover (touch-device path); keep existing phase-machine and callback-stability assertions passing

## 2. Overlay and call sites

- [x] 2.1 Update `CharacterThemeOverlay.tsx` — colour source becomes `previewTheme ?? DEFAULT_THEME`; active transition reads derived value from context
- [x] 2.2 Update `CharacterCard.tsx` — `onMouseEnter` calls `hoverPreview(resolveTheme(character.theme))`, `onMouseLeave` calls `clearHoverPreview()`; pass full `theme` to `TransitionLink`
- [x] 2.3 Update `TransitionLink.tsx` — replace `transitionId` prop with `theme: ThemeConfig`; always calls `navigate(href, theme)`
- [x] 2.4 Update `AppearanceControls.tsx` — Preview button calls `preview(value)` with the live form theme

## 3. Call-site tests

- [x] 3.1 Update `TransitionLink.test.tsx` — theme prop; navigation delegated to `navigate` in all cases
- [x] 3.2 Update `CharacterCard` tests — renamed hover callbacks; `TransitionLink` receives `theme` prop
- [x] 3.3 Update `CharacterThemeOverlay.test.tsx` and `AppearanceControls.test.tsx` — colour source and `preview(value)` assertions

## 4. Verification

- [x] 4.1 Run typecheck, lint, and full web test suite — all green
- [x] 4.2 Grep for stale API usage (`hoveredCharacter`, `setHoveredCharacter`, `preview(` with bare transition id) — no consumers left
- [x] 4.3 Manual smoke test: landing hover preview, card click (desktop), admin preview with custom colours
