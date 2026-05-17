## ADDED Requirements

### Requirement: Centered content column with wing zones

The system SHALL render all pages inside a 3-column CSS grid: left wing | content column | right wing. The content column SHALL be capped at a maximum width (`--content-max-w`, default `1100px`) and SHALL never exceed `100vw - 2rem`. Wings SHALL have a minimum width of `1rem` on all screen sizes and SHALL grow freely once the content column reaches its maximum width.

#### Scenario: Content stays below max-width on large screens

- **WHEN** the viewport is wider than `1100px + 2rem`
- **THEN** the content column width is capped at `1100px` and wings absorb remaining space equally

#### Scenario: Wings remain visible on mobile

- **WHEN** the viewport is narrower than `1100px + 2rem`
- **THEN** each wing is at least `1rem` wide and content fills remaining space

#### Scenario: Content never overflows viewport

- **WHEN** the viewport is any width
- **THEN** the content column width does not exceed `100vw - 2rem`

### Requirement: Optional wing decoration slots

The `PageLayout` component SHALL accept optional `leftWing` and `rightWing` props of type `React.ReactNode`. When a wing prop is provided, its content SHALL be rendered inside the corresponding wing grid cell. When a wing prop is omitted, the wing cell SHALL render empty (preserving its minimum width).

#### Scenario: Page with no decorations

- **WHEN** `PageLayout` is rendered without `leftWing` or `rightWing` props
- **THEN** the content column is centered and wings are empty but still occupy their minimum width

#### Scenario: Character page with decorations

- **WHEN** `PageLayout` is rendered with `leftWing` and `rightWing` containing decoration components
- **THEN** decoration content appears inside the wing cells on both sides of the content column

### Requirement: Wing decorations inherit theme CSS variables

When `PageLayout` is rendered inside a themed wrapper that sets `--theme-bg`, `--theme-text`, and `--theme-accent` CSS custom properties, decoration content rendered in wing props SHALL inherit those variables.

#### Scenario: Forest decoration uses theme accent color

- **WHEN** a character page sets `--theme-accent` on the outer themed div and passes a decoration into `leftWing`
- **THEN** the decoration component can reference `var(--theme-accent)` and resolves to the character's theme color

### Requirement: Consistent layout across all pages

Every public-facing page and every admin page SHALL use `PageLayout` as its outermost content wrapper. No page SHALL apply its own ad-hoc max-width or horizontal centering outside of `PageLayout`.

#### Scenario: Home page uses PageLayout

- **WHEN** the home page renders
- **THEN** the character grid is inside the content column of `PageLayout`

#### Scenario: Admin pages use PageLayout

- **WHEN** any admin page renders
- **THEN** admin content is inside the content column of `PageLayout` with no wing decorations
