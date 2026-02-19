# Journey Images Guide

## Current Setup

The journey page now supports **theme-aware images** that automatically switch between dark and light mode variants.

## Image Naming Convention

To enable automatic theme switching, name your images using this pattern:

```
1-dark.png   → Step 1 (Dark mode)
1-light.png  → Step 1 (Light mode)
2-dark.png   → Step 2 (Dark mode)
2-light.png  → Step 2 (Light mode)
...
7-dark.png   → Step 7 (Dark mode)
7-light.png  → Step 7 (Light mode)
```

## Steps Mapping

| Step # | Journey Stage | Year | Current Image |
|--------|--------------|------|---------------|
| 1 | The Beginning (Departure) | 2018 | departure.png |
| 2 | Student Life (Education) | 2018–2020 | education.png |
| 3 | Moving East (Halifax) | Sept 2020 | halifax.png |
| 4 | Permanent Residency | May 2023 | pr.png |
| 5 | Homecoming | Dec 2023 | homecoming.png |
| 6 | Return to Ontario | Feb 2024 | return.png |
| 7 | Citizenship Pending | Present | citizenship.png |

## How to Add Numbered Images

1. **Create your images** with the naming pattern above (1-dark.png, 1-light.png, etc.)
2. **Place them** in this directory (`public/journey/`)
3. **Update the code** in `components/MyJourney/MyJourney.tsx`:

Find this line (around line 227):
```typescript
return item.image; // Will automatically switch when you add numbered images
```

Replace it with:
```typescript
return numberedImage; // This will use the numbered images
```

4. **Test both themes** to ensure images look good in light and dark mode

## Image Specifications

- **Format**: PNG (with transparency if needed)
- **Recommended size**: 1200x800px or similar 3:2 aspect ratio
- **Optimization**: Use tools like TinyPNG to reduce file size
- **Design tips**:
  - Dark mode images: Use lighter colors, higher contrast
  - Light mode images: Use darker colors, softer contrast
  - Ensure text remains readable over the images

## Fallback Behavior

If numbered images are not found, the system will automatically fall back to the original images (departure.png, education.png, etc.).

## Current Features

✅ Theme-aware image switching
✅ Smooth crossfade transitions
✅ Staggered reveal with blur-to-focus effect
✅ 3D hover with PNG lift animation
✅ Scroll velocity-based motion blur
✅ Enhanced shadows and depth effects
