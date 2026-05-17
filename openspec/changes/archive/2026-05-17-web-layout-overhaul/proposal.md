## Why

The current layout has no max-width constraint and minimal padding, leaving no room for edge decorations or hover animations without encroaching on content. Character pages feel cramped on large screens while the character grid grows unboundedly wide. The site needs a consistent, centered content column with wing zones for decorations — a foundation for the visual identity the app is building toward.

## What Changes

- Introduce a reusable `PageLayout` component defining a 3-column CSS grid: left wing | centered content column | right wing
- Wings shrink on mobile (min ~1rem) and grow freely on large screens once content hits its max-width cap
- All public and admin pages adopt `PageLayout` — consistent structure everywhere
- Character pages pass decoration slots into wing props; other pages leave wings empty
- Character cards on the home page reworked from a multi-column grid to a single-column showcase layout — one wide card per character, full-bleed image (natural height, no forced crop), text overlay at bottom with gradient, parallax zoom on hover
- Remove `xl:grid-cols-5` unbounded grid growth; replace with single-column stack

## Capabilities

### New Capabilities

- `page-layout`: Reusable 3-column grid component with optional wing slots, used by all pages
- `character-showcase-card`: Wide, single-column character card — full-bleed image, text overlay, parallax zoom hover

### Modified Capabilities

<!-- none — no existing spec-level requirements are changing -->

## Impact

- `apps/web/src/components/layout/PageLayout.tsx` — new component
- `apps/web/src/app/layout.tsx` — no change (scroll container stays)
- `apps/web/src/app/(public)/page.tsx` — wraps in `PageLayout`
- `apps/web/src/app/(public)/characters/[slug]/layout.tsx` — wraps in `PageLayout` with wing decoration props; themed div remains outer wrapper
- `apps/web/src/app/admin/layout.tsx` — wraps in `PageLayout`
- `apps/web/src/app/admin/characters/[id]/layout.tsx` — wraps in `PageLayout`
- `apps/web/src/components/character/CharacterCard.tsx` — full rewrite
- `apps/web/src/components/character/CharacterGrid.tsx` — remove multi-column grid, single-column stack
- Tailwind config — add content max-width token if needed
- No API or database changes
