# Decorative Floras Setup Guide

## 📁 Required Asset Structure

Create the following folder structure and add your PNG files:

```
public/
└── assets/
    └── decorative/
        ├── top_under_hero_avatar.png  (156×147px)
        ├── left_middle.png           (328×293px)
        ├── right_middle.png          (500×450px)
        └── bottom_middle.png         (310×293px)
```

## 🚀 Quick Setup Commands

```bash
# Create the decorative assets folder
mkdir -p public/assets/decorative

# Copy your PNG files to the decorative folder
# (Replace with your actual file paths)
cp /path/to/your/top_under_hero_avatar.png public/assets/decorative/
cp /path/to/your/left_middle.png public/assets/decorative/
cp /path/to/your/right_middle.png public/assets/decorative/
cp /path/to/your/bottom_middle.png public/assets/decorative/
```

## ✅ Implementation Status

- [x] DecorativeFloras.tsx component created
- [x] DecorativeFloras.module.css styles implemented
- [x] landing-2/page.tsx updated with DecorativeFloras integration
- [x] Z-index hierarchy properly configured
- [x] Responsive behavior implemented (320px-430px)
- [x] Accessibility features added (aria-hidden, pointer-events: none)
- [ ] PNG assets need to be added to `/public/assets/decorative/`

## 🎨 Visual Placement

```
┌───────────────────────────────────┐
│         Zone A (Hero)             │
│                                   │
│         [🌸 Halo]                 │  ← top_under_hero_avatar.png
│         [Avatar]                  │
│      "Hi, Good morning"           │
│                                   │
│     [Nav Icons on Arch]           │
├───────────────────────────────────┤
│                                   │
│  🌸                               │  ← left_middle.png (extends left)
│         Zone A/B Border           │
│                               🌸  │  ← right_middle.png (extends right)
│                                   │
├───────────────────────────────────┤
│         Zone B (Content)          │
│                                   │
│      [Content Cards]              │
│                                   │
│    🌸                             │  ← bottom_middle.png
│                                   │
└───────────────────────────────────┘
```

## 🔧 Z-Index Hierarchy

```
z-index: 10  → Interactive Content (buttons, text, cards)
z-index: 2   → Decorative Florals (NEW)
z-index: 1   → Glassmorphism overlay
z-index: 0   → Background gradient
```

## 📱 Responsive Behavior

| Screen Size | Halo Opacity | Side Florals Opacity | Behavior |
|-------------|--------------|---------------------|----------|
| 320px       | 0.35         | 0.45               | Most subtle |
| 375px       | 0.4          | 0.5                | Standard |
| 430px+      | 0.5          | 0.6                | Most visible |

## 🎛️ Customization Options

### Adjust Opacity
```css
/* In DecorativeFloras.module.css */
.topUnderAvatarImage {
  opacity: 0.3; /* More subtle (was 0.5) */
}
```

### Adjust Sizes
```css
.leftMiddleImage {
  width: clamp(10rem, 40vw, 16rem); /* Smaller (was 12rem to 18rem) */
}
```

### Adjust Positions
```css
.topUnderAvatar {
  top: clamp(1rem, 6vw, 3rem); /* Higher position (was 2rem to 4rem) */
}
```

## 🐛 Troubleshooting

### Images Not Visible
1. Check file paths: `/public/assets/decorative/filename.png`
2. Verify file names match exactly (case-sensitive)
3. Ensure z-index is correct (should be 2)

### Images Blocking Clicks
1. Verify `pointer-events: none` is applied
2. Check z-index hierarchy (decorative should be below interactive content)

### Horizontal Scroll Issues
1. Ensure `overflow-x: hidden` on `.pageContainer`
2. Check that extending elements don't exceed bounds

## 🎯 Testing Checklist

- [ ] All 4 PNG files are in `/public/assets/decorative/`
- [ ] Images render correctly on page load
- [ ] No horizontal scrolling introduced
- [ ] Can click through florals to interact with content
- [ ] Responsive scaling works on 320px, 375px, 430px screens
- [ ] Opacity adjusts appropriately per screen size
- [ ] Z-index hierarchy maintains interactive content on top

## 🎉 Ready to Use!

Once you've added the PNG files to the decorative folder, the DecorativeFloras component will automatically enhance your landing-2 page with beautiful, non-intrusive floral decorations that follow all architectural rules and provide a responsive, accessible experience.