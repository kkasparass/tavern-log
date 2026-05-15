## ADDED Requirements

### Requirement: Single-column showcase layout for character grid

The character grid on the home page SHALL render one character card per row, stacked vertically. The grid SHALL NOT use multiple columns at any viewport width. Each card SHALL span the full width of the content column.

#### Scenario: Single column on all screen sizes

- **WHEN** the home page renders with multiple characters
- **THEN** characters are stacked vertically, one per row, regardless of viewport width

### Requirement: Full-bleed image with natural height

Each character card SHALL display the character's thumbnail image at full card width with natural height (no forced aspect ratio crop). The image SHALL use `width: 100%; height: auto` sizing so the full image is visible. If no thumbnail exists, the card SHALL display a placeholder at a default `2:3` aspect ratio.

#### Scenario: Card with thumbnail renders without cropping

- **WHEN** a character has a thumbnail URL
- **THEN** the image renders at full card width and its natural height, with no pixels cropped

#### Scenario: Card without thumbnail shows placeholder

- **WHEN** a character has no thumbnail URL
- **THEN** a placeholder container with `aspect-[2/3]` ratio is shown in place of the image

### Requirement: Text overlay with gradient on card image

Each character card SHALL display the character's name, system, and tags overlaid on the image. The overlay SHALL use a bottom-anchored gradient (dark at bottom, transparent at top) to ensure text legibility against any image. The text SHALL be positioned absolutely at the bottom of the card image area.

#### Scenario: Text is legible over light and dark images

- **WHEN** a character card renders
- **THEN** a gradient overlay from transparent to dark covers the lower portion of the image, and name/system/tags are readable on top of it

#### Scenario: All card metadata is present

- **WHEN** a character card renders
- **THEN** the character's name, system name, and tags are all visible in the overlay area

### Requirement: Parallax zoom on hover

Each character card SHALL apply a CSS scale transform to the image on pointer hover, creating a zoom-in effect. The image SHALL be clipped to the card bounds so the zoom does not affect surrounding layout. The transform SHALL animate smoothly with a CSS transition.

#### Scenario: Image zooms on hover without layout shift

- **WHEN** a user hovers over a character card
- **THEN** the image scales up (approximately 1.05–1.10×) within the card bounds with no layout shift

#### Scenario: No zoom on touch devices

- **WHEN** the page is viewed on a touch-only device with no hover capability
- **THEN** the card renders in its default (non-zoomed) state; no zoom is triggered

### Requirement: Card navigates to character page

Each character card SHALL be a navigable link to the character's public profile page. Clicking anywhere on the card SHALL navigate to `/characters/<slug>`. The card SHALL trigger the existing page transition animation on click.

#### Scenario: Card click navigates

- **WHEN** a user clicks a character card
- **THEN** the browser navigates to `/characters/<slug>` using the character's transition animation
