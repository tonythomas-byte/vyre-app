---
inclusion: manual
---

# Vyre App — Daily Development Log

## Purpose
Track daily progress, logic updates, and decisions made during development.

---

## May 5, 2026

### Work Done
- Refactored route structure — moved all pages into route groups: `(auth)`, `(onboarding)`, `(journal)`, `(landing)`
- Deleted old root-level duplicate routes (`/login`, `/journal`, `/onboarding`, etc.)
- Co-located page-specific components inside their page folders
- Removed `PageBackground` double-wrapping from `(auth)` and `(journal)` layouts
- Fixed all broken asset paths across all pages and components
- Restored `JournalModule.tsx` from git history with correct asset path
- Added `Suspense` boundary to `verify-otp` page for `useSearchParams`
- Deleted unused `test/` and `common/` pages
- Renamed `landing.module.css` → `home.module.css` to avoid confusion with landing page
- Deleted `(journal)/layout.tsx` passthrough — no shared layout needed
- Merged Anjali's branch (`Anjali`) into `main` — added `TreasurePillPage` and `PillCard` component

### Logic Updates
- `(auth)/layout.tsx` — removed `PageBackground` wrapper (each auth page has its own)
- `journal/page.tsx` — removed `FooterNav` from all journal pages
- `journal-2/page.tsx`, `journal-3/page.tsx` — removed `PageBackground` and `FooterNav`

---

## May 6, 2026

### Work Done
- Installed `framer-motion` for page transitions and journal entrance animation
- Created `Providers.tsx` with `LayoutGroup` + `AnimatePresence` + `usePathname` key
- Updated `layout.tsx` to use `Providers` wrapper
- Built `JournalEntrance.tsx` with 3-phase animation (initial → settled → bounce)
- Created `hooks/useJournalTransition.ts` with all spring variants
- Updated `HeroWithArchNavigation.tsx` with `layoutId="zen-avatar"` for morph animation
- Built `EntryCard` component with mood avatars, progressive sizing, fixed height
- Built `CalendarDropdown` shared component used in both treasure-pill and entries page
- Created `/treasure-pill/entries` page — scrollable entry list anchored to selected date
- Created `/treasure-pill/pill/[id]` page — pill detail page (upper purple card + lower reflection card)
- Added `PillCard` navigation — clicking pill breaks open then navigates to detail page

### Logic Updates
- Journal animation sequence:
  - `0ms` → avatar at scale(1.8), all else hidden
  - `50ms` → avatar snaps to scale(1), stays still
  - `200ms` → journal card slides up
  - `300ms` → floral rises from below
  - `350ms` → shadow follows
  - `400ms` → floral + shadow bounce once
  - `450ms` → mic buttons appear and bounce
- `dateMoodAvatars` in `EntryCard` — sorted by carousel order (`sad → happy → cry → confused → angry`), deduplicated, max 4 shown with progressive sizing (34px → 28px → 22px → 18px)
- `WheelPicker` — updated to 3D pop effect on selected number using `cubic-bezier(0.34, 1.56, 0.64, 1)`

### Known TODOs
- Avatar on pill card is hardcoded (happy) — should come from user's selected mood in onboarding-2
- `dateMoodAvatars` is mock data — needs backend integration
- `PillCard` moods ("Ecstatic", "Awe", etc.) are Set 1 moods (label a moment); slider avatars are Set 2 (measure change)
- Reflection slider response labels — only "A bit better" (happy) implemented; others need mapping
- "Save Reflection" navigation — currently goes to `/treasure-pill/pill/[id]`; final destination TBD
- Journal-2 and Journal-3 have no "Next" button to continue the flow
- Onboarding-final `handleContinue` navigates to `/landing` — placeholder, needs real destination

---
