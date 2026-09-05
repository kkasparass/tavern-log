## ADDED Requirements

### Requirement: Character field model with name as the only required field

The Character model SHALL consist of optional fields only, except `name` (and the system-managed `slug`, `theme`, `isPublic`, timestamps, and ownership relation). The model SHALL provide `tagline String?` (freeform quick-intro line, max 140 characters), `pronouns String?`, and `designedBy String?`. The model SHALL NOT contain `system`, `campaign`, or `status` fields, and the `CharacterStatus` enum SHALL NOT exist.

#### Scenario: Character creation with name only

- **WHEN** an authenticated admin creates a character with only a `name`
- **THEN** the API responds 201 and the character exists with all other fields null/empty

#### Scenario: Create request without system is accepted

- **WHEN** an authenticated admin posts a create payload omitting `system`, `campaign`, and `status`
- **THEN** the request is not rejected for missing fields (no required-field validation error)

#### Scenario: API responses exclude removed fields

- **WHEN** any public or admin endpoint returns a character
- **THEN** the response contains `tagline`, `pronouns`, and `designedBy` where set, and contains no `system`, `campaign`, or `status` keys

### Requirement: Legacy TTRPG field values migrate into tags

The migration SHALL, before dropping `system` and `campaign`, insert each character's `system` and `campaign` values as `CharacterTag` rows for that character. The backfill SHALL skip null and empty values, and SHALL NOT create duplicate tags for the same character (respecting the `[characterId, tag]` unique constraint). The migration SHALL then drop the `system`, `campaign`, `status` columns and the `CharacterStatus` enum.

#### Scenario: System value becomes a tag

- **WHEN** a character with `system = "D&D 5e"` (and no existing `D&D 5e` tag) is migrated
- **THEN** the character has a `D&D 5e` tag and no `system` value afterwards

#### Scenario: Duplicate tag values are not re-inserted

- **WHEN** a character already has a tag equal to its `system` value
- **THEN** the backfill does not insert a duplicate row

### Requirement: New optional fields surface on character pages

The character profile SHALL display `pronouns` and `designedBy` where set (overview section), and the profile header SHALL display the `tagline` (falling back to `pronouns` when tagline is empty). The OpenGraph description fallback SHALL be `bio ?? tagline ?? name`.

#### Scenario: Tagline renders in profile header

- **WHEN** a character with a tagline is viewed on its public page
- **THEN** the header shows the tagline text beneath the character name

#### Scenario: Pronouns fallback for header

- **WHEN** a character has no tagline but has pronouns
- **THEN** the header shows the pronouns beneath the character name

#### Scenario: OpenGraph fallback order

- **WHEN** a character has no bio
- **THEN** the OG description uses the tagline if present, otherwise the character name

### Requirement: Admin character form exposes reworked fields

The admin character create/edit form SHALL provide inputs for `tagline`, `pronouns`, and `designedBy` (all optional), and SHALL NOT contain inputs for `system`, `campaign`, or `status`. Submitted values SHALL be persisted via the existing admin character endpoints and reflected on the public page.

#### Scenario: Form submits reworked field set

- **WHEN** an admin fills in tagline, pronouns, and designedBy and saves the character
- **THEN** a PUT request carries the new fields (and no removed fields) and the public page shows the updated values

## MODIFIED Requirements

### Requirement: Text overlay with gradient on card image

Each character card SHALL display the character's name, tagline, and tags overlaid on the image. When no tagline is set, the card SHALL fall back to displaying the character's first 3 tags as the subtext line; when no tags exist either, the subtext line SHALL be omitted. The overlay SHALL use a bottom-anchored gradient (dark at bottom, transparent at top) to ensure text legibility against any image. The text SHALL be positioned absolutely at the bottom of the card image area.

#### Scenario: Text is legible over light and dark images

- **WHEN** a character card renders
- **THEN** a gradient overlay from transparent to dark covers the lower portion of the image, and name/tagline/tags are readable on top of it

#### Scenario: Card metadata with tagline

- **WHEN** a character card renders for a character with a tagline
- **THEN** the character's name, tagline, and tags are all visible in the overlay area, and no system label is shown

#### Scenario: Tagline fallback to tags

- **WHEN** a character has no tagline but has 5 tags
- **THEN** the card overlay shows only the first 3 tags as the subtext line
