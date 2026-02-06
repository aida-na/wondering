# Wondering Design System - Complete Reference

A comprehensive guide to replicate the Wondering visual style. This document covers the V2 warm cream-toned color system, typography, button components, animations, and utility classes.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Button Component](#button-component)
5. [Animations](#animations)
6. [Utility Classes](#utility-classes)

---

## Architecture Overview

### Tech Stack

- **CSS Framework**: Tailwind CSS
- **Component Library**: Radix UI primitives
- **Variant Management**: class-variance-authority (CVA)
- **Font**: Inter (primary), Share Tech Mono (buttons), Rubik (logo)

### Theme Application

The V2 theme is applied by wrapping content in the `.theme-v2` class:

```tsx
// Page-level theme application
<div className="theme-v2 inter-font bg-surface">
  {/* All content uses V2 colors */}
</div>
```

### Token Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│  Tier 1: Primitive Tokens (CSS Variables)                    │
│  Raw HSL values: --primitive-v2-blue-500: 202 100% 74%       │
├──────────────────────────────────────────────────────────────┤
│  Tier 2: Semantic Tokens (CSS Variables)                     │
│  Purpose-based: --color-brand-primary: var(--primitive-v2-blue-500) │
├──────────────────────────────────────────────────────────────┤
│  Tier 3: Tailwind Utilities                                  │
│  Class names: bg-brand, text-text-primary                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Color System

### V2 Primitive Color Palette

All colors are defined in HSL format: `hue saturation% lightness%`

#### Base Scale (Warm Neutrals) - Cream to Dark Brown

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-base-light`  | 48 100% 97%      | #FFFCF0   | Main surface       |
| `--primitive-v2-base-50`     | 43 28% 93%       | #F4F0E5   | Secondary surface  |
| `--primitive-v2-base-100`    | 40 21% 88%       | #E9E5DA   | Tertiary surface   |
| `--primitive-v2-base-150`    | 37 17% 84%       | #DED9CF   | Hover states       |
| `--primitive-v2-base-200`    | 33 15% 80%       | #D4CDC4   | Borders            |
| `--primitive-v2-base-300`    | 29 11% 71%       | #BEB6AD   | Strong borders     |
| `--primitive-v2-base-400`    | 26 9% 63%        | #A89F97   | Border hover       |
| `--primitive-v2-base-500`    | 23 8% 54%        | #928781   | Tertiary text      |
| `--primitive-v2-base-600`    | 17 10% 46%       | #7D706B   | Secondary text alt |
| `--primitive-v2-base-700`    | 13 13% 37%       | #675955   | Secondary text     |
| `--primitive-v2-base-800`    | 10 15% 28%       | #51423E   | Strong text        |
| `--primitive-v2-base-850`    | 9 18% 24%        | #473633   | Darker text        |
| `--primitive-v2-base-900`    | 6 21% 20%        | #3C2A28   | Near black         |
| `--primitive-v2-base-950`    | 5 25% 16%        | #311F1D   | Darkest            |
| `--primitive-v2-base-dark`   | 4 35% 11%        | #261312   | Primary text       |

#### Brand Blue Scale (Sky Blue)

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-blue-100`    | 202 100% 95%     | #E5F4FF   | Light background   |
| `--primitive-v2-blue-200`    | 202 100% 89%     | #CAEAFF   | Brand background   |
| `--primitive-v2-blue-300`    | 202 100% 84%     | #B0DFFF   | Brand border       |
| `--primitive-v2-blue-400`    | 202 100% 79%     | #95D5FF   | Highlight          |
| `--primitive-v2-blue-500`    | 202 100% 74%     | #7BCAFF   | **Primary brand**  |
| `--primitive-v2-blue-600`    | 202 51% 59%      | #62A2CC   | Brand hover        |
| `--primitive-v2-blue-700`    | 202 36% 45%      | #4A7999   | Brand active       |
| `--primitive-v2-blue-800`    | 202 36% 30%      | #315166   | Dark brand         |
| `--primitive-v2-blue-900`    | 202 36% 15%      | #192833   | Darkest brand      |

#### Success/Teal Scale

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-green-300`   | 154 43% 85%      | #CDE9DC   | Success background |
| `--primitive-v2-green-500`   | 165 43% 55%      | #5ABDAC   | Success primary    |
| `--primitive-v2-green-600`   | 170 35% 44%      | #48978A   | Button shadow 1    |
| `--primitive-v2-green-700`   | 170 35% 33%      | #367167   | Button shadow 2    |
| `--primitive-v2-green-900`   | 168 100% 16%     | #005244   | Success text       |

#### Error/Coral Scale (Pinky)

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-pinky-300`   | 13 100% 88%      | #FFD0C1   | Error background   |
| `--primitive-v2-pinky-500`   | 7 100% 69%       | #FF7562   | Error primary      |
| `--primitive-v2-pinky-600`   | 7 100% 55%       | #FF4D3D   | Button shadow 1    |
| `--primitive-v2-pinky-700`   | 7 100% 42%       | #D63828   | Button shadow 2    |
| `--primitive-v2-pinky-900`   | 7 100% 30%       | #990000   | Error text/danger  |

#### Warning/Orange Scale

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-orange-300`  | 28 100% 76%      | #FFB983   | Warning background |
| `--primitive-v2-orange-500`  | 36 100% 56%      | #FFA01E   | Warning primary    |

#### Info/Violet Scale

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-violet-300`  | 230 60% 89%      | #D7DCF5   | Info background    |
| `--primitive-v2-violet-500`  | 227 100% 74%     | #7992FF   | Info primary       |

#### Moss/Yellow-Green Scale

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-moss-300`    | 70 47% 71%       | #CDD597   | Moss background    |
| `--primitive-v2-moss-500`    | 75 47% 41%       | #879A39   | Moss primary       |

#### Yellow Scale

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-yellow-300`  | 44 78% 72%       | #F1D67E   | Yellow background  |
| `--primitive-v2-yellow-500`  | 43 73% 54%       | #DFB431   | Yellow primary     |

#### Red Scale (Alternative Error)

| Token                        | HSL Value        | Hex       | Usage              |
| ---------------------------- | ---------------- | --------- | ------------------ |
| `--primitive-v2-red-300`     | 10 40% 76%       | #DAB2A8   | Red background     |
| `--primitive-v2-red-500`     | 1 61% 36%        | #942822   | Red primary        |

---

### Semantic Color Tokens (V2)

These tokens are automatically activated within `.theme-v2`:

```css
.theme-v2 {
  /* Brand */
  --color-brand-primary: var(--primitive-v2-blue-500);        /* #7BCAFF */
  --color-brand-primary-hover: var(--primitive-v2-blue-600);  /* #62A2CC */
  --color-brand-primary-active: var(--primitive-v2-blue-700); /* #4A7999 */
  --color-brand-bg: var(--primitive-v2-blue-100);             /* #E5F4FF */
  --color-brand-border: var(--primitive-v2-blue-200);         /* #CAEAFF */
  --color-brand-text: var(--primitive-v2-blue-600);           /* #62A2CC */

  /* Surfaces */
  --color-surface: var(--primitive-v2-base-light);            /* #FFFCF0 */
  --color-surface-secondary: var(--primitive-v2-base-50);     /* #F4F0E5 */
  --color-surface-tertiary: var(--primitive-v2-base-100);     /* #E9E5DA */
  --color-surface-hover: var(--primitive-v2-base-100);        /* #E9E5DA */

  /* Text */
  --color-text-primary: var(--primitive-v2-base-dark);        /* #261312 */
  --color-text-secondary: var(--primitive-v2-base-700);       /* #675955 */
  --color-text-tertiary: var(--primitive-v2-base-500);        /* #928781 */
  --color-text-disabled: var(--primitive-v2-base-300);        /* #BEB6AD */
  --color-text-inverse: var(--primitive-v2-base-light);       /* #FFFCF0 */

  /* Borders */
  --color-border: var(--primitive-v2-base-200);               /* #D4CDC4 */
  --color-border-hover: var(--primitive-v2-base-400);         /* #A89F97 */
  --color-border-strong: var(--primitive-v2-base-500);        /* #928781 */

  /* Success */
  --color-success: var(--primitive-v2-green-500);             /* #5ABDAC */
  --color-success-bg: var(--primitive-v2-green-300);          /* #CDE9DC */
  --color-success-text: var(--primitive-v2-green-900);        /* #005244 */

  /* Error */
  --color-error: var(--primitive-v2-pinky-500);               /* #FF7562 */
  --color-error-bg: var(--primitive-v2-pinky-300);            /* #FFD0C1 */
  --color-error-text: var(--primitive-v2-pinky-900);          /* #990000 */

  /* Warning */
  --color-warning: var(--primitive-v2-orange-500);            /* #FFA01E */
  --color-warning-bg: var(--primitive-v2-orange-300);         /* #FFB983 */

  /* Info */
  --color-info: var(--primitive-v2-violet-500);               /* #7992FF */
  --color-info-bg: var(--primitive-v2-violet-300);            /* #D7DCF5 */
}
```

### Button Color Tokens (V2)

```css
.theme-v2 {
  /* Secondary Button (Neutral) */
  --color-button-secondary: var(--primitive-v2-base-150);           /* #DED9CF */
  --color-button-secondary-border: var(--primitive-v2-base-500);    /* #928781 */
  --color-button-secondary-hover: var(--primitive-v2-base-400);     /* #A89F97 */
  --color-button-secondary-active: var(--primitive-v2-base-500);    /* #928781 */
  --color-button-secondary-foreground: var(--primitive-v2-base-dark); /* #261312 */

  /* Tertiary Button (Light) */
  --color-button-tertiary: var(--primitive-v2-base-light);          /* #FFFCF0 */
  --color-button-tertiary-border: var(--primitive-v2-base-300);     /* #BEB6AD */
  --color-button-tertiary-shadow: var(--primitive-v2-base-200);     /* #D4CDC4 */
  --color-button-tertiary-shadow-active: var(--primitive-v2-base-300); /* #BEB6AD */
  --color-button-tertiary-foreground: var(--primitive-v2-base-dark); /* #261312 */

  /* Success Button (Teal) */
  --color-button-success: var(--primitive-v2-green-500);            /* #5ABDAC */
  --color-button-success-border: var(--primitive-v2-green-700);     /* #367167 */
  --color-button-success-shadow: var(--primitive-v2-green-600);     /* #48978A */
  --color-button-success-foreground: var(--primitive-v2-base-light); /* #FFFCF0 */

  /* Danger Button (Coral) */
  --color-button-danger: var(--primitive-v2-pinky-900);             /* #990000 */
  --color-button-danger-border: var(--primitive-v2-pinky-700);      /* #D63828 */
  --color-button-danger-shadow: var(--primitive-v2-pinky-600);      /* #FF4D3D */
  --color-button-danger-foreground: var(--primitive-v2-pinky-300);  /* #FFD0C1 */
}
```

### Tailwind Utility Classes

| Tailwind Class           | Purpose                    | V2 Color               |
| ------------------------ | -------------------------- | ---------------------- |
| `bg-brand`               | Primary brand background   | #7BCAFF (sky blue)     |
| `bg-brand-hover`         | Hover state                | #62A2CC                |
| `text-brand`             | Brand text                 | #7BCAFF                |
| `bg-surface`             | Main background            | #FFFCF0 (warm cream)   |
| `bg-surface-secondary`   | Secondary background       | #F4F0E5                |
| `bg-surface-hover`       | Hover background           | #E9E5DA                |
| `text-text-primary`      | Primary text               | #261312 (dark brown)   |
| `text-text-secondary`    | Secondary text             | #675955                |
| `text-text-tertiary`     | Tertiary text              | #928781                |
| `text-text-inverse`      | Inverse (on dark)          | #FFFCF0                |
| `border-border`          | Default border             | #D4CDC4                |
| `bg-success-bg`          | Success background         | #CDE9DC                |
| `text-success-text`      | Success text               | #005244                |
| `bg-error-bg`            | Error background           | #FFD0C1                |
| `text-error-text`        | Error text                 | #990000                |
| `bg-info-bg`             | Info background            | #D7DCF5                |
| `text-info-text`         | Info text                  | #7992FF                |
| `bg-warning-bg`          | Warning background         | #FFB983                |
| `text-warning-text`      | Warning text               | #FFA01E                |

---

## Typography

### Font Families

```css
/* Primary font - all UI text */
font-family: 'Inter', sans-serif;

/* Button font - monospace for game feel */
.share-tech-mono-font {
  font-family: 'Share Tech Mono', monospace;
}

/* Logo font */
.logo-font {
  font-family: 'Rubik', serif;
  font-weight: 500;
}

/* Serif font - for headings/emphasis */
.young-serif-font {
  font-family: 'Young Serif', serif;
}
```

### Font Loading

Include in your HTML `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Rubik:wght@500&family=Share+Tech+Mono&family=Young+Serif&display=swap"
  rel="stylesheet"
/>
```

### Text Hierarchy

```tsx
// Primary heading
<h1 className="text-text-primary text-2xl font-semibold">Heading</h1>

// Secondary text
<p className="text-text-secondary text-base">Description</p>

// Tertiary/helper text
<span className="text-text-tertiary text-sm">Additional info</span>

// Disabled text
<span className="text-text-disabled text-sm">Unavailable</span>
```

---

## Button Component

### Base Styles (All Buttons)

```css
/* Base button classes */
inline-flex
items-center
justify-center
gap-2
whitespace-nowrap
rounded-xl              /* 12px border radius */
text-sm
font-medium
transition-all
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-brand
focus-visible:ring-offset-2
aria-disabled:pointer-events-none
aria-disabled:opacity-50
```

### Button Variants

#### Primary (Default)

3D button with sky blue brand color and depth effect.

```tsx
<Button variant="primary">Primary Action</Button>
```

```css
/* Styles */
share-tech-mono-font     /* Monospace font */
font-base
uppercase
border border-brand-active
bg-brand                 /* #7BCAFF */
text-text-primary        /* #261312 */

/* 3D shadow effect - 2 layers */
shadow-[0_4px_0_0_hsl(var(--color-brand-primary-hover)),0_5px_0_0_hsl(var(--color-brand-primary-active))]

/* Hover - lift up */
hover:-translate-y-0.5
hover:shadow-[0_6px_0_0_hsl(var(--color-brand-primary-hover)),0_7px_0_0_hsl(var(--color-brand-primary-active))]

/* Active - press down */
active:translate-y-1
active:shadow-none
```

#### Secondary

Warm neutral 3D button for secondary actions.

```tsx
<Button variant="secondary">Secondary</Button>
```

```css
border border-button-secondary-border  /* #928781 */
bg-button-secondary                    /* #DED9CF */
text-button-secondary-foreground       /* #261312 */

/* 3D shadow */
shadow-[0_4px_0_0_hsl(var(--color-button-secondary-hover)),0_5px_0_0_hsl(var(--color-button-secondary-active))]
```

#### Tertiary

Subtle 3D button with cream background.

```tsx
<Button variant="tertiary">Tertiary</Button>
```

```css
border border-button-tertiary-border   /* #BEB6AD */
bg-button-tertiary                     /* #FFFCF0 */
text-button-tertiary-foreground        /* #261312 */

/* Subtle shadow */
shadow-[0_4px_0_0_hsl(var(--color-button-tertiary-shadow)),0_5px_0_0_hsl(var(--color-button-tertiary-shadow-active))]
```

#### Primary Success

Teal 3D button for positive confirmations.

```tsx
<Button variant="primary-success">Confirm</Button>
```

```css
border border-button-success-border    /* #367167 */
bg-button-success                      /* #5ABDAC */
text-text-primary

shadow-[0_4px_0_0_hsl(var(--color-button-success-shadow)),0_5px_0_0_hsl(var(--color-button-success-border))]
```

#### Danger

Coral 3D button for destructive actions.

```tsx
<Button variant="danger">Delete</Button>
```

```css
border border-button-danger-border     /* #D63828 */
bg-button-danger-foreground            /* #FFD0C1 */
text-button-danger                     /* #990000 */

shadow-[0_4px_0_0_hsl(var(--color-button-danger-shadow)),0_5px_0_0_hsl(var(--color-button-danger-border))]
```

#### Outline

Simple bordered button without 3D effect.

```tsx
<Button variant="outline">Cancel</Button>
```

```css
border border-border                   /* #D4CDC4 */
bg-surface                             /* #FFFCF0 */
text-text-primary
shadow-sm
hover:bg-surface-hover
```

#### Ghost

Minimal button with no background.

```tsx
<Button variant="ghost">Subtle</Button>
```

```css
text-text-primary
hover:bg-surface-hover
```

#### Link

Text-style button.

```tsx
<Button variant="link">Learn More</Button>
```

```css
text-brand                             /* #7BCAFF */
underline-offset-4
hover:underline
```

#### Game

Duolingo-style bold button with extra rounded corners.

```tsx
<Button variant="game">Continue</Button>
```

```css
rounded-2xl                            /* 16px radius */
border border-brand-hover
bg-brand
font-bold
tracking-wide
text-text-primary

shadow-[0_4px_0_0_hsl(var(--color-brand-primary-hover)),0_4px_0_1px_hsl(var(--color-brand-primary-active))]

hover:bg-brand-hover
active:translate-y-1
active:shadow-none
```

### Button Sizes

| Size      | Classes                          | Use Case            |
| --------- | -------------------------------- | ------------------- |
| `sm`      | `rounded-lg px-3 py-1.5 text-xs` | Compact buttons     |
| `md`      | `px-4 py-2 text-sm`              | Default             |
| `lg`      | `px-4 py-3 text-base`            | Emphasized actions  |
| `xl`      | `px-6 py-3.5 text-lg`            | Hero CTAs           |
| `icon`    | `size-9` (36px)                  | Icon-only buttons   |
| `icon-sm` | `size-8` (32px)                  | Small icon buttons  |
| `icon-lg` | `size-10` (40px)                 | Large icon buttons  |
| `game`    | `px-8 py-4 text-base`            | Game-style buttons  |

### Button Props

```tsx
interface ButtonProps {
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'primary-success'
    | 'outline'
    | 'ghost'
    | 'link'
    | 'game'
    | 'danger'
    | 'success'
    | 'warning'
    | 'info';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg' | 'game';
  fullWidth?: boolean;      // Adds w-full
  isLoading?: boolean;      // Shows spinner
  loadingText?: string;     // Text during loading (default: "Loading")
  leadingIcon?: ReactNode;  // Icon before text
  trailingIcon?: ReactNode; // Icon after text
  uppercase?: boolean;      // Default true - uppercase text
  asChild?: boolean;        // Render as Slot (Radix)
}
```

### Loading State

```tsx
<Button isLoading loadingText="Saving...">Save</Button>
```

Renders a spinning SVG with the loading text:

```tsx
<span role="status" className="inline-flex items-center gap-2">
  <svg className="size-4 animate-spin">...</svg>
  Saving...
</span>
```

### 3D Button Effect Recreation

To recreate the 3D button effect from scratch with V2 colors:

```css
.button-3d-v2 {
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  font-family: 'Share Tech Mono', monospace;
  text-transform: uppercase;
  transition: all 150ms;

  /* V2 Colors */
  background: hsl(202 100% 74%);       /* #7BCAFF - brand primary */
  border: 1px solid hsl(202 36% 45%);  /* #4A7999 - brand active */
  color: hsl(4 35% 11%);               /* #261312 - text primary */

  /* 3D shadow effect */
  box-shadow:
    0 4px 0 0 hsl(202 51% 59%),        /* #62A2CC - brand hover */
    0 5px 0 0 hsl(202 36% 45%);        /* #4A7999 - brand active */
}

.button-3d-v2:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 0 0 hsl(202 51% 59%),
    0 7px 0 0 hsl(202 36% 45%);
}

.button-3d-v2:active {
  transform: translateY(4px);
  box-shadow: none;
}
```

---

## Animations

### Keyframe Animations

```css
/* Fade in */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Slide up from bottom (mobile) */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

/* Slide up (desktop - with scale) */
@media (min-width: 768px) {
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(0) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}

/* Pulse opacity */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Pulse with scale */
@keyframes pulse-scale {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

/* Hero reveal */
@keyframes heroReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Cascade drop in - bouncy entrance */
@keyframes cascadeDropIn {
  0% {
    opacity: 0;
    transform: translateY(-20px) scale(0.85);
  }
  60% {
    opacity: 1;
    transform: translateY(4px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Typing indicator dots */
@keyframes typingDot {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-8px);
  }
}
```

### Animation Classes

```css
.animate-fade-in { animation: fadeIn 0.2s ease-in-out; }
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.animate-pulse-scale { animation: pulseScale 2s ease-in-out infinite; }
.animate-hero-reveal { animation: heroReveal 0.6s ease-out forwards; }
.animate-cascade-drop-in { animation: cascadeDropIn 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
```

### Cascade Delay Utilities

For staggered entrance animations (220ms increments):

```css
.cascade-delay-0 { animation-delay: 0ms; }
.cascade-delay-1 { animation-delay: 220ms; }
.cascade-delay-2 { animation-delay: 440ms; }
.cascade-delay-3 { animation-delay: 660ms; }
.cascade-delay-4 { animation-delay: 880ms; }
/* ... up to cascade-delay-10 (2200ms) */
```

Usage:

```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className={`animate-cascade-drop-in animate-on-load cascade-delay-${i}`}
  >
    {item.content}
  </div>
))}
```

### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .animate-hero-reveal,
  .animate-cascade-drop-in {
    animation: none !important;
    opacity: 1;
  }
  .animate-on-load {
    opacity: 1;
  }
}
```

---

## Utility Classes

### Safe Area Insets (iOS)

```css
.safe-area-top { padding-top: env(safe-area-inset-top); }
.safe-area-bottom { padding-bottom: max(env(safe-area-inset-bottom), 1rem); }
.safe-area-left { padding-left: env(safe-area-inset-left); }
.safe-area-right { padding-right: env(safe-area-inset-right); }
.safe-area-x { /* left + right */ }
.safe-area-y { /* top + bottom */ }
.safe-area-all { /* all sides */ }

/* Nav-aware safe areas */
.pt-nav-safe { padding-top: calc(4rem + env(safe-area-inset-top)); }
.pb-nav-safe { padding-bottom: calc(6rem + env(safe-area-inset-bottom)); }
```

### Scrollbar Hiding

```css
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
```

### Line Clamping

```css
.line-clamp-1 { /* Truncate to 1 line with ellipsis */ }
.line-clamp-2 { /* Truncate to 2 lines */ }
.line-clamp-3 { /* Truncate to 3 lines */ }
```

### Hover Effects

```css
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px hsl(0 0% 9% / 0.15);
}
```

### Focus Styles

```css
button:focus,
input:focus,
textarea:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px hsl(202 100% 74% / 0.1); /* V2 brand blue */
}
```

### Custom Scrollbar (V2)

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: hsl(43 28% 93%);  /* base-50 */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb {
  background: hsl(33 15% 80%);  /* base-200 */
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: hsl(26 9% 63%);   /* base-400 */
}
```

---

## Example Implementations

### Page Layout

```tsx
<div className="theme-v2 inter-font safe-area-top min-h-screen bg-surface">
  <header className="border-b border-border bg-surface-secondary px-4 py-3">
    <h1 className="text-lg font-semibold text-text-primary">Page Title</h1>
  </header>
  <main className="mx-auto max-w-2xl px-4 py-6">
    {/* Content */}
  </main>
</div>
```

### State Alert

```tsx
// Success
<div className="rounded-lg border border-success-border bg-success-bg p-4 text-success-text">
  Operation successful!
</div>

// Error
<div className="rounded-lg border border-error-border bg-error-bg p-4 text-error-text">
  Something went wrong
</div>

// Info
<div className="rounded-lg border border-info-border bg-info-bg p-4 text-info-text">
  Here's some helpful information
</div>
```

### Card Component

```tsx
<div className="rounded-xl border border-border bg-surface p-4 shadow-sm">
  <h3 className="font-semibold text-text-primary">Card Title</h3>
  <p className="mt-2 text-text-secondary">Card description goes here.</p>
</div>
```

### Input Field

```tsx
<input
  type="text"
  placeholder="Enter text..."
  className="w-full rounded-lg border border-border bg-surface p-3 text-base text-text-primary placeholder:text-text-tertiary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
/>
```

### Status Badge

```tsx
// Success
<span className="rounded-sm bg-success-bg px-2 py-1 text-xs text-success-text">
  Completed
</span>

// Info
<span className="rounded-sm bg-info-bg px-2 py-1 text-xs text-info-text">
  In Progress
</span>

// Warning
<span className="rounded-sm bg-warning-bg px-2 py-1 text-xs text-warning-text">
  Pending
</span>
```

---

## Border Radius

Default border radius scale:

| Variable      | Value                     | Usage          |
| ------------- | ------------------------- | -------------- |
| `--radius`    | 0.5rem (8px)              | Base radius    |
| `rounded-sm`  | calc(var(--radius) - 4px) | Small elements |
| `rounded-md`  | calc(var(--radius) - 2px) | Medium         |
| `rounded-lg`  | var(--radius)             | Default        |
| `rounded-xl`  | 0.75rem (12px)            | Buttons        |
| `rounded-2xl` | 1rem (16px)               | Game buttons   |

---

## Box Shadows

```css
shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

---

Last updated: 2026-02-06
