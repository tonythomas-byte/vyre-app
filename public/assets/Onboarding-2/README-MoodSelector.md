# Onboarding Page 2 - Mood Selector Carousel

## 🎨 Component Overview

A smooth, swipe-based mood selector carousel with:
- **3-item view**: Center avatar + 50% visible left/right avatars
- **Smooth drag tracking** during swipe
- **Decisive snap animation** on release
- **Synced floral indicators** that change with avatar selection
- **Disabled Continue button** until mood is selected
- **Fully responsive** (320px - 430px) with natural flexbox & clamp-based sizing

---

## 📦 Files Created

1. **`MoodSelector.tsx`** - Carousel component with drag/swipe logic
2. **`MoodSelector.module.css`** - Responsive carousel styles
3. **`Onboarding2.tsx`** - Page component with mood state management
4. **`Onboarding2.module.css`** - Page layout and styling

---

## 🚀 Implementation Steps

### 1. Add Files to Your Project

```
your-project/
├── components/
│   ├── MoodSelector.tsx
│   └── MoodSelector.module.css
├── app/
│   └── onboarding-2/
│       ├── Onboarding2.tsx (or page.tsx)
│       └── Onboarding2.module.css
```

### 2. Replace Placeholder Images

**Current:** Component uses emoji placeholders for avatars and colored circles for florals.

**Replace with your actual images:**

#### Avatar Images
Created folder: D:\vyre app\public\assets\Onboarding-2

Add 5 avatar PNGs:
- `happy.png`
- `sad.png`
- `angry.png`
- `confused.png`
- `crying.png`

#### Floral Images
Created folder: `D:\vyre app\public\assets\Onboarding-2'

Add 5 floral PNGs (matching naming convention):
- `Fhappy.png`
- `Fsad.png`
- `Fangry.png`
- `Fconfused.png`
- `Fcrying.png`

#### Update the Component
In `MoodSelector.tsx`, **uncomment** the `<Image>` components (lines marked with `// Uncomment when you have actual images`) and **remove** the placeholder divs.

### 3. Wire Up Parent State Management

In your main onboarding flow (e.g., `app/onboarding/page.tsx`):

```tsx
import { useState } from 'react'
import Onboarding2 from './onboarding-2/Onboarding2'
import { MoodType } from '@/components/MoodSelector'

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(2)
  const [userMood, setUserMood] = useState<MoodType | null>(null)

  const handleMoodContinue = (mood: MoodType) => {
    setUserMood(mood)
    // Navigate to next step or save to backend
    setCurrentStep(3)
  }

  return (
    <>
      {currentStep === 2 && (
        <Onboarding2 onContinue={handleMoodContinue} />
      )}
      {/* Other onboarding steps */}
    </>
  )
}
```

---

## ⚙️ Customization

### Adjust Swipe Sensitivity
In `MoodSelector.tsx`, line ~67:
```tsx
const threshold = containerWidth * 0.3 // 30% swipe threshold
```
- Lower value (0.2) = easier to swipe
- Higher value (0.4) = harder to swipe

### Change Animation Duration
In `MoodSelector.module.css`, line ~26:
```css
transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
```
- Faster: `200ms`
- Slower: `400ms`

### Modify Scale/Opacity
In `MoodSelector.tsx`, lines ~147-149:
```tsx
opacity: isActive ? 1 : isVisible ? 0.5 : 0,
transform: isActive ? 'scale(1.2)' : 'scale(1)',
```
- Increase active scale: `scale(1.3)` or `scale(1.5)`
- Change fade: `0.3` or `0.7`

### Update Colors
In `Onboarding2.module.css`, change background gradient (line ~7) to match your design.

---

## 🎯 Features Implemented

✅ **Carousel Behavior**
- Shows 3 avatars (center + 50% left/right)
- Smooth drag tracking (no instant jumps)
- Snap animation on release (200-300ms ease-out)

✅ **Visual Feedback**
- Selected mood: 1.2x scale, 100% opacity
- Non-selected: 1x scale, 50% opacity
- Hidden moods: 0% opacity, no pointer events

✅ **Floral Sync**
- All 5 florals visible at bottom
- Active floral: 1.1x scale, 100% opacity
- Inactive florals: 40% opacity
- Changes dynamically with swipe

✅ **State Management**
- Parent component controls flow
- `onMoodSelect` callback passes selected mood
- Continue button disabled until selection made

✅ **Responsive Design**
- Natural flexbox layout
- `clamp()` for fluid sizing (320px - 430px)
- `rem` units for accessibility
- Touch + mouse support

✅ **Accessibility**
- `prefers-reduced-motion` support
- Keyboard navigation ready (can add arrow keys)
- Semantic HTML structure

---

## 🐛 Troubleshooting

**Carousel doesn't move:**
- Check that `containerRef` is attached to `.carouselWrapper`
- Verify `touch-action: pan-y` in CSS (prevents browser swipe navigation)

**Images not showing:**
- Ensure paths match: `/public/assets/avatars/happy.png`
- Uncomment `<Image>` components in `MoodSelector.tsx`
- Remove placeholder divs

**Continue button not enabling:**
- Check `selectedMood` state in parent
- Verify `onMoodSelect` callback is wired correctly

**Swipe feels laggy:**
- Check if device has hardware acceleration enabled
- Reduce transition duration to 200ms
- Test on physical device (not just browser DevTools)

---

## 🎨 Design Notes

This implementation follows the **frontend-design skill** principles:
- **Bold aesthetic**: Soft gradients, rounded shapes, zen-like simplicity
- **Motion design**: Two-phase interaction (smooth drag + decisive snap)
- **Spatial composition**: Asymmetric 3-item carousel with centered focus
- **Typography**: Clean, readable heading with natural responsive scaling
- **Details**: Subtle shadows, smooth transitions, hover states

The design intentionally uses:
- Gentle pastel gradients (not harsh purples on white)
- Organic rounded shapes (not sharp geometric patterns)
- Breathing room with `clamp()` spacing
- Contextual feedback (floral sync, button states)

---

## 📱 Testing Checklist

- [ ] Test on 320px width (smallest mobile)
- [ ] Test on 375px width (iPhone SE)
- [ ] Test on 430px width (iPhone Pro Max)
- [ ] Swipe left/right works smoothly
- [ ] Florals sync with avatar changes
- [ ] Continue button disables/enables correctly
- [ ] No horizontal page scroll during swipe
- [ ] Touch and mouse both work
- [ ] Reduced motion preference respected

---

## 🚀 Next Steps

1. Add your actual avatar and floral images
2. Integrate with your onboarding flow state management
3. Add backend persistence for selected mood
4. Optional: Add keyboard arrow key navigation
5. Optional: Add haptic feedback on mobile (vibration)

Enjoy your smooth mood selector carousel! 🧘‍♀️✨
