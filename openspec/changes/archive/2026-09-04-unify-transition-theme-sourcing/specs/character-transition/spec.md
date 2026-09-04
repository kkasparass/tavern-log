# Spec Delta: character-transition

## ADDED Requirements

### Requirement: Single theme source for the transition overlay

The transition overlay system SHALL maintain a single theme source (`previewTheme`) that determines the colours and transition animation of `CharacterThemeOverlay`. Every activation path — hover preview, navigation, and admin preview — SHALL populate this theme source before entering the `covering` phase. The overlay SHALL NOT source colours from any state other than `previewTheme` (with `DEFAULT_THEME` as an unreachable-in-practice fallback).

#### Scenario: Hover preview uses hovered character's colours

- **WHEN** a user hovers a character card on the landing page
- **THEN** `hoverPreview(theme)` sets `previewTheme` to that character's resolved theme and the overlay's gradient renders in that character's colours

#### Scenario: Admin preview uses live form colours

- **WHEN** the admin clicks the Preview transition button in the theme form
- **THEN** `preview(theme)` sets `previewTheme` to the current form theme and the covering overlay renders in the form's colours, not `DEFAULT_THEME`

#### Scenario: Navigation without prior hover uses clicked character's colours

- **WHEN** a character card is activated without a preceding hover event (e.g. touch-device tap)
- **THEN** `navigate(href, theme)` sets `previewTheme` to that character's theme and the covering overlay renders in the character's colours

### Requirement: Active transition derived from the theme source

The active transition id SHALL be derived from the theme source (`previewTheme?.transition ?? null`) rather than stored as independent state. No code path SHALL set the active transition without also setting the theme source.

#### Scenario: Transition id always consistent with theme

- **WHEN** any activation path sets `previewTheme` to a theme with transition `t`
- **THEN** the overlay mounts the animation component for `t` and no other

#### Scenario: Theme cleared clears transition

- **WHEN** `previewTheme` is cleared (hover leave or uncover complete)
- **THEN** the derived active transition is `null` and the overlay renders nothing when idle

### Requirement: Theme-carrying navigation API

`TransitionProvider` SHALL expose `navigate(href, theme)` which routes immediately when `theme.transition` is `null` and otherwise stores `href`, sets the theme source, and enters the `covering` phase. `TransitionLink` SHALL accept the full theme (not a bare transition id) and delegate the null-transition decision to `navigate`.

#### Scenario: Card with no transition navigates directly

- **WHEN** a card whose theme has `transition: null` is clicked
- **THEN** navigation occurs immediately via `router.push` without entering the `covering` phase

#### Scenario: Card with a transition covers first

- **WHEN** a card whose theme has transition `t` is clicked
- **THEN** the overlay enters `covering` and routes to the href when the cover animation completes

### Requirement: Admin preview API takes the full theme

`TransitionProvider` SHALL expose `preview(theme: ThemeConfig)` which sets the theme source and enters the `covering` phase. Without a pending navigation href, cover completion SHALL proceed directly to `uncovering` and then to `idle`.

#### Scenario: Preview cycle completes without navigation

- **WHEN** `preview(theme)` is called from the admin form
- **THEN** the overlay covers with the theme's colours and animation, uncovers, and returns to `idle` without any route change
