# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Context

This repo contains new features for **Wondering** (https://wondering.app), an educational app ("Learn What You Thought You Couldn't"). The main app is maintained separately (iOS + web) and we don't have the full repo. Features built here must be **pluggable** — easy to merge into the existing codebase with minimal friction.

## Target Stack (must match the existing app)

- **Framework:** React 19+ with Vite
- **Styling:** Tailwind CSS with CSS custom properties (HSL-based design tokens)
- **Components:** Radix UI primitives
- **Variant Management:** class-variance-authority (CVA)
- **Fonts:** Inter (UI), Share Tech Mono (buttons), Rubik (logo), Young Serif (headings) via Google Fonts
- **Language:** TypeScript

## Design System

Full spec lives in `Design System Detailed.md`. Key rules:

- **Theme wrapper:** All UI must be inside `.theme-v2` class scope
- **Three-tier tokens:** Primitive CSS vars → Semantic CSS vars → Tailwind utility classes
- **Color palette:** Warm cream surfaces (`#FFFCF0`), sky blue brand (`#7BCAFF`), dark brown text (`#261312`)
- **Buttons:** 3D shadow effect (box-shadow stacking), 8 variants, monospace font (Share Tech Mono) on primary/game variants
- **Animations:** `cascadeDropIn` for staggered entrances (220ms delay increments), `heroReveal` for hero content, always include `prefers-reduced-motion` support
- **Border radius:** `rounded-xl` (12px) for buttons/cards, `rounded-2xl` (16px) for game elements
- **Mobile:** iOS safe area insets via `env(safe-area-inset-*)` utility classes

## Development

```bash
cd wondering-app
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Production build (runs tsc + vite build)
```

## Project Structure

```
wondering-app/
├── src/
│   ├── components/ui/     # Reusable UI primitives (Button, Badge, Toast, DropdownMenu)
│   ├── components/        # App-level components (Sidebar)
│   ├── features/courses/  # Course sharing feature (self-contained)
│   │   ├── types.ts           # Course, ShareLinkData types
│   │   ├── share-utils.ts     # Share link generation, Web Share API / clipboard
│   │   ├── courses-page.tsx   # Course library table with share in kebab menu
│   │   ├── shared-course-page.tsx  # Landing page when opening a share link
│   │   ├── mock-data.ts       # Demo data
│   │   └── BACKEND_CONTRACT.md # API + DB schema spec for the sharing feature
│   ├── lib/utils.ts       # cn() helper (clsx + tailwind-merge)
│   └── index.css          # Full design system tokens + Tailwind config
```

Path alias: `@/` → `src/`

## Pluggability Rules

- Use only semantic token CSS variables or Tailwind utility classes from the design system — never hardcode hex/HSL values
- Export components as named exports with clear prop interfaces
- Keep feature code self-contained in feature directories
- No global CSS overrides — scope styles to feature components
- Match the existing patterns: function components, hooks, CVA for variants
