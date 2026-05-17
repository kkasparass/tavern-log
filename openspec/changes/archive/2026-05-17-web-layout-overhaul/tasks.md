## 1. PageLayout Component

- [x] 1.1 Create `apps/web/src/components/layout/PageLayout.tsx` with 3-column CSS grid (`minmax(1rem, 1fr) min(var(--content-max-w), 100% - 2rem) minmax(1rem, 1fr)`)
- [x] 1.2 Add `--content-max-w: 1100px` to `:root` in `apps/web/src/app/globals.css`
- [x] 1.3 Accept `leftWing`, `rightWing` (optional `React.ReactNode`) and `className` props; render wing cells even when props are empty

## 2. Adopt PageLayout on Public Pages

- [x] 2.1 Wrap `apps/web/src/app/(public)/page.tsx` main content in `<PageLayout>`
- [x] 2.2 Wrap `apps/web/src/app/(public)/characters/[slug]/layout.tsx` content in `<PageLayout leftWing={...} rightWing={...}>` inside the existing themed div
- [x] 2.3 Move `DecorationSlot` for `PageEdgeLeft` and `PageEdgeRight` into `leftWing` and `rightWing` props of `PageLayout` (remove their current absolute positioning if any)

## 3. Adopt PageLayout on Admin Pages

- [x] 3.1 Wrap `apps/web/src/app/admin/layout.tsx` content in `<PageLayout>`
- [x] 3.2 Wrap `apps/web/src/app/admin/characters/[id]/layout.tsx` content in `<PageLayout>` — covered by parent admin layout; nesting another PageLayout would break the grid

## 4. Character Showcase Card

- [x] 4.1 Rewrite `CharacterCard.tsx`: remove square portrait + text-below layout; add `overflow-hidden rounded-lg` wrapper with `group` class
- [x] 4.2 Add full-bleed image using Next.js `<Image>` with `width`/`height` props for natural sizing (`w-full h-auto block`); fall back to `aspect-[2/3]` placeholder when no thumbnail
- [x] 4.3 Add gradient overlay (`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent`)
- [x] 4.4 Add text overlay anchored to bottom (`absolute bottom-0 left-0 right-0 p-6`): name, system, tags
- [x] 4.5 Add parallax zoom: `transition-transform duration-500 ease-out group-hover:scale-110` on the `<Image>` element

## 5. Character Grid Layout

- [x] 5.1 In `CharacterGrid.tsx`, replace multi-column grid (`grid-cols-1 … xl:grid-cols-5`) with single-column stack (`flex flex-col gap-6` or `grid grid-cols-1 gap-6`)

## 6. Verify & Clean Up

- [x] 6.1 Confirm filter dropdowns (`Select` components) are still visible and usable above the card stack on home page
- [x] 6.2 Smoke-test character page on mobile: wings collapse to `1rem`, content fills remaining space, decorations don't overflow
- [x] 6.3 Smoke-test admin pages: forms not unexpectedly narrow due to wing margins
- [x] 6.4 Run `npm test --workspace=apps/web` — fix any layout-related test failures
