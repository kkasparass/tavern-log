## ADDED Requirements

### Requirement: Per-character card template stored in theme JSON

Each character's card template choice SHALL be stored as a discriminated object nested inside the existing `theme` JSON: `theme.card = { template, settings }`, where `template` is a `CardTemplateId` (`portrait`, `banner`, `compact`, `polaroid`) and `settings` is a template-specific object. The API SHALL NOT change: `theme` continues to pass through create, update, and public read routes verbatim, and no database migration SHALL be required.

#### Scenario: Template choice survives save and reload

- **WHEN** an admin selects the `banner` template with custom settings and saves the character
- **THEN** the stored `theme` JSON contains `card: { template: "banner", settings: <chosen values> }` and the public character response returns it unchanged

#### Scenario: Storage requires no API change

- **WHEN** a character is created or updated with `theme.card` present
- **THEN** the API stores and returns the `theme` blob without rejecting or stripping the `card` key, and no migration runs

### Requirement: Card template registry

The web app SHALL maintain a card template registry mapping every `CardTemplateId` to an entry containing: a display label, a card component, per-template settings controls, and default settings. Adding a new template SHALL require only one registry entry plus its components — no changes to the resolver, admin section, or grid.

#### Scenario: Registry covers all template ids

- **WHEN** the registry is inspected
- **THEN** every `CardTemplateId` has an entry with a label, a card component, settings controls, and declared default settings

### Requirement: Settings resolution with defaults and type sanitisation

Card settings SHALL be resolved by merging stored settings over the selected template's declared defaults. Unknown keys SHALL be dropped, and values whose type does not match the corresponding default's type SHALL fall back to the default. Resolution SHALL NOT require hand-mapped field lists per template beyond the declared defaults.

#### Scenario: Stored settings merge over defaults

- **WHEN** a character stores `card.settings = { imageAlignment: "right" }` for the `banner` template
- **THEN** the resolved settings are the banner defaults with `imageAlignment` overridden to `"right"`

#### Scenario: Unknown and mistyped keys are dropped

- **WHEN** a character stores `card.settings = { showTags: "yes", bogus: 1 }` for the `compact` template
- **THEN** the resolved settings equal the compact defaults (the string `"yes"` and unknown `bogus` key are discarded)

### Requirement: Portrait fallback for missing, legacy, or invalid card data

When `theme.card` is absent, when `template` is missing or not a known `CardTemplateId`, or when the character has a legacy flat theme shape, the card SHALL resolve to `{ template: "portrait", settings: <portrait defaults> }` — preserving current behaviour with no data migration.

#### Scenario: Character without card data renders the current card

- **WHEN** the landing page renders a character whose theme has no `card` key (including legacy `bgColor/textColor/accentColor` rows)
- **THEN** the card renders exactly as the current portrait card with default settings

#### Scenario: Invalid template id falls back to portrait

- **WHEN** a character's `theme.card.template` is `"hologram"` (not a registered id)
- **THEN** the card resolves to the portrait template

### Requirement: Admin template picker with per-template settings controls

The admin character edit form SHALL include a Card Template section, sibling to the theme section, containing: a template dropdown listing registry labels, the selected template's settings controls, and state separate from the theme state slice. Changing the template SHALL reset settings to the newly selected template's defaults.

#### Scenario: Template switch resets settings

- **WHEN** the admin switches the selected template from `compact` (with `showTags: false`) to `polaroid`
- **THEN** the settings state resets to the polaroid defaults and the polaroid settings controls render

#### Scenario: Template section state is separate from theme state

- **WHEN** the admin changes the card template or its settings
- **THEN** the theme state (preset, colours, bgPattern, transition, decorations) is unchanged, and `preset` is not set to `"custom"`

### Requirement: Inline live card preview in admin form

The Card Template section SHALL render an inline live preview using the actual card rendering path with the character's current data (name, tagline, tags, thumbnail) and the currently selected template and settings. The preview SHALL exhibit working hover behaviour: hovering previews the character's theme transition, and leaving clears it.

#### Scenario: Preview reflects selection with hover effects

- **WHEN** the admin selects the `polaroid` template and hovers the inline preview card
- **THEN** the preview renders the polaroid template with the character's data, hovering triggers the theme hover-preview with the character's resolved theme, and mouse-leave clears it

### Requirement: Card selection submits inside the theme blob

Form submission SHALL merge the card state into the submitted `theme` object (`{ ...theme, card }`), and preset/theme operations SHALL NOT modify card state. Editing presets or clicking a preset SHALL NOT change the selected card template or its settings.

#### Scenario: Submitted payload carries card state

- **WHEN** the admin form is submitted after selecting a template and adjusting settings
- **THEN** the `theme` payload contains both the resolved theme fields and `card: { template, settings }`

#### Scenario: Preset fill does not stomp card choice

- **WHEN** the admin clicks a theme preset after choosing the `compact` card template
- **THEN** the card template and its settings remain `compact` with their current values
