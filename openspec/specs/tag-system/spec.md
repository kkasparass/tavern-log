## ADDED Requirements

### Requirement: Tags-only landing page filtering

The landing page character grid SHALL filter characters by tag selection only. The system SHALL NOT provide a system-based filter. The tag filter SHALL combine with the text/filter state such that selecting a tag shows only characters carrying that tag.

#### Scenario: Filtering by tag

- **WHEN** a user selects the tag "goblin" on the landing page
- **THEN** only characters carrying the "goblin" tag are shown

#### Scenario: No system filter exists

- **WHEN** the landing page renders
- **THEN** no system dropdown or system-based filter control is present

#### Scenario: Unknown tag shows empty state

- **WHEN** a tag filter yields no characters
- **THEN** the grid renders an empty state rather than unfiltered results

### Requirement: Tag suggestion endpoint

The API SHALL expose `GET /tags?q=<prefix>` returning up to 10 distinct tag strings with their usage counts, matching the given prefix case-insensitively, ordered by usage count descending with a deterministic tiebreak on tag ascending. The suggestion pool SHALL only include tags belonging to public characters (`isPublic: true`). The endpoint SHALL be publicly accessible without authentication.

#### Scenario: Prefix suggestions with counts

- **WHEN** the client requests `GET /tags?q=go` and tags "goblin" (used 3 times) and "gods" (used 1 time) exist on public characters
- **THEN** the response lists "goblin" before "gods", each with its usage count

#### Scenario: Results are capped and deterministic

- **WHEN** more than 10 tags match the prefix
- **THEN** the response contains exactly 10 tags, ordered by usage count descending, ties broken alphabetically

#### Scenario: Private character tags are excluded

- **WHEN** a tag exists only on a character with `isPublic: false`
- **THEN** that tag does not appear in suggestions

#### Scenario: Empty or no-match query

- **WHEN** `q` is empty or matches no tags
- **THEN** the response contains an empty list (an empty `q` MAY return the globally most-used tags)

### Requirement: Tag autocomplete in admin character form

The admin character form tag input SHALL display a suggestion dropdown of existing tags (fetched from the suggestion endpoint, debounced) while the user types. Clicking a suggestion or pressing Enter on a highlighted suggestion SHALL add that tag. Suggestions SHALL exclude tags already on the character (case-insensitive). The dropdown SHALL support arrow-key navigation, SHALL close on Escape, on empty input, and on blur, and SHALL expose combobox semantics (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, listbox with `role="option"`).

#### Scenario: Suggestions narrow as the user types

- **WHEN** the user types "go" in the tag input and waits for the debounce
- **THEN** the dropdown lists matching tags fetched from the suggestion endpoint

#### Scenario: Adding a suggested tag

- **WHEN** the user presses Enter on a highlighted suggestion
- **THEN** the tag is added as a chip, the dropdown closes, and the suggestion does not reappear for the already-added tag

#### Scenario: Duplicate tags are not suggested

- **WHEN** the character already has the tag "mage" and suggestions would include "mage" (case-insensitive match)
- **THEN** "mage" is absent from the dropdown

#### Scenario: Keyboard navigation and dismissal

- **WHEN** the user presses the down/up arrows, then Escape
- **THEN** the highlighted suggestion moves and the dropdown closes without adding a tag

#### Scenario: Request debouncing

- **WHEN** the user types rapidly
- **THEN** at most one suggestion request fires per debounce window
