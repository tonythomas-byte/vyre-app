# Bugfix Requirements Document

## Introduction

The 3D mood selector carousel currently exhibits vertical scattering of items instead of maintaining a horizontal plane. The implementation uses a circular 3D approach with `rotateY(angle) translateZ(radius)` transforms that causes avatars and floral icons to scatter vertically. Additionally, carousel items inherit incorrect dimensions (382px wrapper width instead of fixed 140px avatar/52px floral sizes), preventing proper positioning.

This bugfix will transition from a 5-item circular 3D carousel to a 3-item horizontal carousel using `translateX` for positioning and `translateZ` for depth perspective, ensuring all items remain on the same horizontal line.

## Bug Analysis

### Reference Implementation

A working horizontal 3D carousel implementation exists at `public/assets/Onboarding-2/debug/` that demonstrates the correct approach:
- Uses `translateX(offset * step + drag)` for horizontal positioning
- Uses `translateZ(isCenter ? 0 : -150)` for depth (center at Z=0, sides at Z=-150)
- Fixed item sizes: 140px avatars, 52px florals (never inherit from wrapper)
- Only 3 items visible: center (scale 1.0) + sides (scale 0.6, opacity 0.8)
- Items positioned with `inset: 0` + `margin: auto` + `transform-origin: center center`
- Scale as standalone CSS property (not in transform chain) prevents vertical drift
- Floral carousel drag offset scaled proportionally: `drag * (FLORAL_STEP / AVATAR_STEP)`

### Current Behavior (Defect)

1.1 WHEN the carousel renders with `rotateY(angle) translateZ(radius)` transforms THEN the system positions items in a circular 3D pattern causing vertical scattering instead of horizontal alignment

1.2 WHEN carousel items are rendered THEN the system applies 382px wrapper width to items instead of fixed widths (140px for avatars, 52px for florals)

1.3 WHEN the carousel displays 5 mood avatars THEN the system shows all 5 items simultaneously instead of limiting visibility to 3 items at a time

1.4 WHEN radius calculations use refs THEN the system fails to trigger re-renders when dimensions change, causing console to show incorrect 382px width even after CSS changes

1.5 WHEN the carousel uses circular positioning logic THEN the system calculates radius using `(width / 2) / tan(PI / numberOfCells)` which is incompatible with horizontal plane requirements

1.6 WHEN scale is included in the transform chain THEN the system applies scaling after translateZ, causing items to drift vertically from the horizontal plane

### Expected Behavior (Correct)

2.1 WHEN the carousel renders THEN the system SHALL position items using `translateX` for horizontal positioning combined with `translateZ` for depth, keeping all items on the same horizontal plane

2.2 WHEN carousel items are rendered THEN the system SHALL apply fixed dimensions (140px for avatars, 52px for florals) independent of wrapper width

2.3 WHEN the carousel displays mood avatars THEN the system SHALL show exactly 3 visible avatars at a time with the center avatar at Z=0 (scale 1.0) and adjacent avatars at Z=-150 (scale 0.6)

2.4 WHEN the carousel initializes THEN the system SHALL start with the Happy mood (index 1) centered

2.5 WHEN the carousel uses horizontal positioning THEN the system SHALL use flexbox layout with `translateX` transforms for sliding and `translateZ` for depth perspective

2.6 WHEN the user drags or swipes THEN the system SHALL navigate between moods horizontally, with the first swipe dismissing the popup and enabling the Continue button

2.7 WHEN the floral carousel renders THEN the system SHALL apply the same horizontal carousel logic with synchronized positioning to the avatar carousel above

2.8 WHEN the carousel renders on mobile devices (320px-430px width) THEN the system SHALL use `clamp()` for fluid scaling to maintain responsive sizing

### Unchanged Behavior (Regression Prevention)

3.1 WHEN the user performs the first swipe THEN the system SHALL CONTINUE TO dismiss the popup and trigger the `onFirstSwipe` callback

3.2 WHEN the user drags the carousel THEN the system SHALL CONTINUE TO prevent dragging during animation states

3.3 WHEN the carousel snaps to a position THEN the system SHALL CONTINUE TO use 300ms ease-out transition timing

3.4 WHEN a mood is selected THEN the system SHALL CONTINUE TO call `onMoodSelect` with the selected mood type

3.5 WHEN the user clicks on an avatar after the first swipe THEN the system SHALL CONTINUE TO allow direct selection and snap to that mood

3.6 WHEN the carousel animates THEN the system SHALL CONTINUE TO apply scale and opacity transitions for visual feedback

3.7 WHEN the shadow circle renders THEN the system SHALL CONTINUE TO display between the avatar and floral carousels with proper styling

3.8 WHEN the component handles touch events THEN the system SHALL CONTINUE TO support both mouse and touch interactions for drag/swipe gestures
