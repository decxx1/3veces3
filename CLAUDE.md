# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands use `bun` from the project root:

```sh
bun install          # Install dependencies
bun dev              # Dev server at localhost:4321
bun build            # Build to ./dist/
bun preview          # Preview production build
bun astro check      # Type-check .astro files
```

## Architecture

This is an Astro 6 static site for `tresvecestres.com.ar`, styled with Tailwind CSS v4 (loaded via Vite plugin, not PostCSS). The package manager is **bun**.

**Layout system:** All pages must use `src/layouts/Layout.astro`, which wraps every page with `<Header>`, `<main><slot /></main>`, and `<Footer>`. The layout accepts required SEO props (`title`, `canonical`, `metaDescription`, `metaImg`) and an optional `preLoad` array for `<link rel="preload">` tags — use the `Preload` type from `src/types/Preload.ts`.

**Path alias:** `@/` maps to `src/` (configured in both `tsconfig.json` and usable in `.astro` files).

**Fonts:** Montserrat variable font (both normal and italic weights) is imported inside the layout — do not re-import in individual pages or components.

**Transitions:** Astro's `<ClientRouter />` (View Transitions) is enabled globally in the layout.

**Static assets:** Place images under `public/assets/images/` and logos/favicons under `public/assets/logos/`. Reference them with absolute paths (e.g. `/assets/images/foo.webp`).

**TypeScript:** Extends `astro/tsconfigs/strict`. JSX is configured for React (`react-jsx`), so React components can be used alongside `.astro` files.
