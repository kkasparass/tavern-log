# Design: Unify transition theme sourcing in `previewTheme`

## Context

The 2.2 transition system uses a 5-phase state machine in `TransitionProvider` (`idle → hover-preview → covering → uncovering → idle`). The overlay's colours come from `hoveredCharacter ?? DEFAULT_THEME` (CharacterThemeOverlay.tsx:14). `hoveredCharacter` is only set by `setHoveredCharacter`, which fires on card hover. `preview(transitionId)` (admin) and the touch-device click path never set it, so both render `DEFAULT_THEME` colours.

The state machine itself — phases, `onCoverComplete`/`onUncoverComplete` callbacks, `pendingHref` ref — is correct, tested, and stays untouched. Only theme sourcing changes.

Existing specs cover the card (`character-showcase-card`) and page layout (`page-layout`) but the transition system has no capability spec; this change introduces one.

## Goals / Non-Goals

**Goals:**
- One colour source for the overlay, fed by every activation path (hover, navigate, preview)
- Admin theme Preview renders the live form colours (BL-1)
- Touch-device tap covers in the character's colours without a prior hover
- Remove the possibility of `activeTransition` drifting out of sync with the active theme

**Non-Goals:**
- Changing the phase machine, callback contract, or overlay animation components (`FloralBloomOverlay`, `BellsFlowerOverlay` keep their `theme` prop)
- Cross-fading between outgoing/incoming themes (D15 cut-and-restart behaviour is preserved)
- Rendering decorations in the overlay (excluded per D17)
- Any change to transition scoping (D12 — landing page only, stands)

## Decisions

### D1: Single `previewTheme` state (option B) over extending `preview` only (option A) or hover-API misuse (option C)

- **A** (`preview(transitionId, theme?)`) fixes only the admin symptom; the touch-device hole remains
- **C** (admin calls `setHoveredCharacter(theme)` before preview) works but corrupts the hover API's meaning and leaves the touch hole
- **B** fixes both with one concept, is the honest model ("why is the overlay showing?" is orthogonal to "whose colours is it showing?"), and gives BL-3 (card template previews) a clean extension point

Cost is the larger blast radius (5 source files, 4 test files) — acceptable because call sites are few, fresh, and fully tested; the phase machine is pinned by existing tests so regressions surface immediately.

### D2: Derive `activeTransition` from `previewTheme`

A transition never exists without a theme, so `activeTransition = previewTheme?.transition ?? null` removes a state variable and its sync risk. No behavioural change — every code path that set `activeTransition` now sets `previewTheme` (with a transition) first.

### D3: Null-transition case moves inside `navigate`

`TransitionLink` currently checks `transitionId === null` and calls `router.push` directly. With a `theme` prop, the check becomes `theme.transition === null` and lives in `navigate`. One decision point instead of two, and `TransitionLink` becomes a thin wrapper.

### D4: Callback renames — `hoverPreview`/`clearHoverPreview`

`hoveredCharacter` stored a `ThemeConfig`, not a character — the name was already a lie. `previewTheme` + `hoverPreview()` names say what each thing is. Callback stability contract (`useCallback`, same reference across renders) is preserved.

## Risks / Trade-offs

- [Prop signature changes break an untested call site] → Grep for `useTransition(`, `TransitionLink`, and `preview(` consumers; typecheck catches all signature mismatches
- [Admin preview fires while a landing-page hover is somehow active] → Impossible today (admin has no cards); `preview()` forcing `covering` is the same behaviour as before; no new guard needed
- [`DEFAULT_THEME` fallback masks a future colour-sourcing bug] → Acceptable; it's the existing behaviour and every activation path now sets `previewTheme`, so the fallback is unreachable in practice
- [Touch-device behaviour changes on real hardware only] → The new "navigate sets colours without prior hover" unit test covers the logic; manual smoke test on a touch device recommended after deploy

## Migration Plan

Single client-side refactor, deployed with the next web push. No data, API, or feature-flag migration. Rollback = revert the commit; no persisted state involved. Sequence within the change: provider refactor first (with test renames), then call sites, so typecheck guides the rest.

## Open Questions

None. The two design questions raised during planning (swatch hue sourcing, picker scope) belong to BL-5, not this change.
