## Context

Current layout: root `app/layout.tsx` provides a scroll container and header; each page/layout applies its own `p-4 sm:p-8` padding with no max-width. The character page (`characters/[slug]/layout.tsx`) wraps everything in a themed `div` that sets CSS custom properties (`--theme-bg`, `--theme-text`, `--theme-accent`) and positions `DecorationSlot` components absolutely for left/right edge decorations. Those slots have nowhere structured to live — they float over content because no wing zones exist.

The home page character grid uses `grid-cols-1` through `xl:grid-cols-5`, growing unboundedly wide. Cards are square-portrait with text below.

## Goals / Non-Goals

**Goals:**

- Single `PageLayout` component defining the 3-column wing grid, used by all public and admin pages
- Content column always smaller than viewport; wings absorb remaining space
- Wing props optional — pages without decorations pass nothing
- Character page: themed div stays outer wrapper, `PageLayout` sits inside it so wing decorations inherit theme CSS vars
- Character cards: single-column showcase, full-bleed image (natural height, no crop), text overlay, parallax zoom on hover

**Non-Goals:**

- Decorations on the home page or admin pages (wings exist, just empty for now)
- Free colour picker or per-character wing decoration config (Phase 2)
- Changes to API, Prisma schema, or auth
- Mobile navigation changes

## Decisions

### D1: CSS Grid for the 3-column layout

`grid-template-columns: minmax(1rem, 1fr) min(var(--content-max-w), 100% - 2rem) minmax(1rem, 1fr)`

Wings are always at least `1rem` — never zero — so there's always a sliver of breathing room on mobile. Content column is capped at `--content-max-w` (set to `1100px`) and never exceeds `100% - 2rem`. At `1100px + 2rem = 1132px` viewport, wings start growing freely.

**Alternatives considered:**

- `max-w + mx-auto` on each page: simpler, but gives no structured wing zone for decorations to live in.
- Flexbox: possible, but CSS Grid with named areas is cleaner for the 3-zone model.

### D2: `PageLayout` as a presentational component, not a Next.js layout

`PageLayout` is a plain React component (`components/layout/PageLayout.tsx`), not an `app/*/layout.tsx` file. Each Next.js layout or page imports and renders it directly. This avoids Next.js App Router's limitation where child pages can't inject content into parent layout slots.

Props:

```ts
interface PageLayoutProps {
  children: React.ReactNode;
  leftWing?: React.ReactNode;
  rightWing?: React.ReactNode;
  className?: string;
}
```

### D3: Themed div wraps PageLayout on character pages

```
<div style={{ --theme-bg, --theme-text, --theme-accent }}>   ← sets CSS vars
  <PageLayout leftWing={<DecorationSlot left />} rightWing={<DecorationSlot right />}>
    <header />
    <CharacterTabs />
    <main>{children}</main>
  </PageLayout>
</div>
```

Wing decoration components inherit CSS vars from the outer themed div. No prop-drilling of theme values into `PageLayout`.

### D4: Character card — image drives container height (no forced aspect ratio)

```tsx
<div className="relative overflow-hidden rounded-lg">
  <img className="block h-auto w-full" /> {/* drives height */}
  <div className="absolute inset-0 bg-gradient-to-t ..." /> {/* overlay */}
  <div className="absolute bottom-0 p-6">name, system, tags</div>
</div>
```

Using Next.js `<Image>` with `width`/`height` from the source or a known aspect ratio. If thumbnails don't carry dimension metadata, use `fill` inside a container with `aspect-[2/3]` as a safe default — revisit if art dimensions become tracked in the API.

**Alternatives considered:**

- `object-cover` with fixed aspect ratio: clips art that doesn't match — rejected.
- `object-contain` with fixed ratio: adds letterbox bars — worse than natural sizing.

### D5: Parallax zoom via CSS transform, not JS

```tsx
// on the img inside overflow-hidden card
className = "transition-transform duration-500 ease-out group-hover:scale-110";
```

Card root has `group` and `overflow-hidden`. The image scales inside the clipped container — zoom effect without layout shift. No Framer Motion needed for this effect (Framer Motion already used for page transitions; keep concerns separate).

### D6: Single-column card stack, full content-column width

`CharacterGrid` drops the responsive multi-column grid. Cards stack vertically, each filling the full content column width. No max card width — the content column cap (`1100px`) is the effective max.

## Risks / Trade-offs

- **Image dimensions unknown at render time** → If the API doesn't return image dimensions, Next.js `<Image>` with `fill` requires a sized container. Use `aspect-[2/3]` container as fallback. Actual image may not be 2:3 — could result in slight letterboxing at the container boundary. Mitigation: accept this for now; revisit when/if image metadata is stored in DB.
- **Wing decorations are absolutely positioned inside grid cells** → Decorations that overflow their wing cell will be clipped or cause scroll. Current forest decorations are purely visual SVG/CSS — acceptable. Flag for future decoration authors.
- **Admin pages get wings with no decoration content** → Empty wing cells at `1rem` min-width add a tiny margin on mobile that didn't exist before. Visually fine; confirm no admin form gets unexpectedly narrow.
- **Hover zoom on touch devices** → `group-hover` doesn't fire on touch. Cards will render without the zoom effect on mobile — acceptable (parallax zoom is an enhancement, not a navigation cue).

## Open Questions

- Should `--content-max-w` be a Tailwind theme token or just a CSS custom property set on `:root`? Either works; CSS custom property on `:root` is simpler and doesn't require Tailwind config changes.
- Should card text overlay show a short bio excerpt (requires API change) or stay name/system/tags only? Scoped to name/system/tags for this change — bio preview deferred.
