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

#### Scenario: No subtext data

- **WHEN** a character has no tagline and no tags
- **THEN** the card overlay shows the name with no subtext line
