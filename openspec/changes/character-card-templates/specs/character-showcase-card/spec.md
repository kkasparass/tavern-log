## MODIFIED Requirements

### Requirement: Full-bleed image with natural height

The `portrait` template card SHALL display the character's thumbnail image at full card width with natural height (no forced aspect ratio crop). The image SHALL use `width: 100%; height: auto` sizing so the full image is visible. If no thumbnail exists, the card SHALL display a placeholder at a default `2:3` aspect ratio. Other templates SHALL follow their own image presentation rules (banner, compact, polaroid).

#### Scenario: Card with thumbnail renders without cropping

- **WHEN** a character with the `portrait` template has a thumbnail URL
- **THEN** the image renders at full card width and its natural height, with no pixels cropped

#### Scenario: Card without thumbnail shows placeholder

- **WHEN** a character with the `portrait` template has no thumbnail URL
- **THEN** a placeholder container with `aspect-[2/3]` ratio is shown in place of the image

### Requirement: Text overlay with gradient on card image

The `portrait` template card SHALL display the character's name, tagline, and tags overlaid on the image. When no tagline is set, the card SHALL fall back to displaying the character's first 3 tags as the subtext line; when no tags exist either, the subtext line SHALL be omitted. The overlay SHALL use a bottom-anchored gradient (dark at bottom, transparent at top) to ensure text legibility against any image. The text SHALL be positioned absolutely at the bottom of the card image area. This shared subtext logic (`tagline ?? first 3 tags`, omitted when both empty) SHALL apply to every card template's text presentation.

#### Scenario: Text is legible over light and dark images

- **WHEN** a character card with the `portrait` template renders
- **THEN** a gradient overlay from transparent to dark covers the lower portion of the image, and name/tagline/tags are readable on top of it

#### Scenario: Card metadata with tagline

- **WHEN** a character card renders for a character with a tagline
- **THEN** the character's name, tagline, and tags are all visible in the overlay area, and no system label is shown

#### Scenario: Tagline fallback to tags

- **WHEN** a character with the `portrait` template has no tagline but has 5 tags
- **THEN** the card overlay shows only the first 3 tags as the subtext line

#### Scenario: No subtext data

- **WHEN** a character with the `portrait` template has no tagline and no tags
- **THEN** the card overlay shows the name with no subtext line

#### Scenario: Shared subtext fallback across templates

- **WHEN** a character with the `banner` template has no tagline but has 4 tags
- **THEN** the banner card's subtext line shows the first 3 tags

### Requirement: Parallax zoom on hover

The `portrait` template card SHALL apply a CSS scale transform to the image on pointer hover, creating a zoom-in effect. The image SHALL be clipped to the card bounds so the zoom does not affect surrounding layout. The transform SHALL animate smoothly with a CSS transition. Other templates MAY apply their own hover styling, but SHALL NOT change the theme hover-preview behaviour.

#### Scenario: Image zooms on hover without layout shift

- **WHEN** a user hovers over a character card with the `portrait` template
- **THEN** the image scales up (approximately 1.05–1.10×) within the card bounds with no layout shift

#### Scenario: No zoom on touch devices

- **WHEN** the page is viewed on a touch-only device with no hover capability
- **THEN** the card renders in its default (non-zoomed) state; no zoom is triggered

### Requirement: Card navigates to character page

Each character card — regardless of its template — SHALL be a navigable link to the character's public profile page. Clicking anywhere on the card SHALL navigate to `/characters/<slug>`. The card SHALL trigger the existing page transition animation on click, driven by the character's resolved theme.

#### Scenario: Card click navigates

- **WHEN** a user clicks a character card of any template
- **THEN** the browser navigates to `/characters/<slug>` using the character's transition animation

#### Scenario: Every template navigates identically

- **WHEN** the landing page shows cards in mixed templates (portrait, banner, compact, polaroid)
- **THEN** clicking any of them navigates to that character's page through the same transition mechanism

## ADDED Requirements

### Requirement: Template-driven card rendering

Each landing-page character card SHALL render according to that character's stored card template (resolved from `theme.card`). The landing grid SHALL retain its single-column layout; cards of different templates stack one per row, each spanning the full content width.

#### Scenario: Mixed templates render per character

- **WHEN** the landing page renders characters stored with different card templates
- **THEN** each card renders in its own character's template, stacked one per row in a single column
