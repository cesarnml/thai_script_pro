# Current Project State

This document describes the implemented state of `thai_script_pro` as of March 28, 2026.

This file is the source of truth for the shipped MVP in this repository. Historical planning docs in `docs/` remain useful background, but they do not override the behavior documented here.

## Product summary

The app is a single-page worksheet generator for Thai script practice. It is entirely client-side and currently focuses on worksheet configuration, live preview, and PDF export.

## MVP locked decisions

These decisions define the current MVP and should not be silently widened by later planning:

- Output is `PDF download` only. Print support is out of scope for MVP.
- Paper size is not user-configurable in MVP. Export targets `A4` only.
- The shipped font scope is the current in-app set: `Traditional`, `Modern`, `Cursive`.
- Phase 2 planning is gated on MVP alignment and stronger regression coverage for current flows, not on adding more surface area first.

## Implemented behavior

### Content selection

- `44` Thai consonants are available in traditional order
- `28` vowel forms are available for practice
- Consonants can be selected individually or through preset groups:
  - `LCG1`: Low Class Consonants, Unpaired
  - `LCG2`: Low Class Consonants, Paired
  - `MC`: Middle Class Consonants
  - `HC`: High Class Consonants
- Vowels can be selected individually or through preset groups:
  - `SHORT`
  - `LONG`
- Each category supports `Select All` and `Clear`

### Worksheet options

The current `SheetConfig` supports:

- `rowsPerCharacter`: `1` through `8`
- `columns`: `3` through `12`, constrained by selected font size and printable width
- `ghostCopiesPerRow`
- `gridGuide`: `cross`, `sandwich`, `thai`
- `font`: `traditional`, `modern`, `cursive`
- `fontSize`: `small`, `medium`, `large`

Default configuration:

- `rowsPerCharacter: 3`
- `columns: 3`
- `ghostCopiesPerRow: 2`
- `gridGuide: thai`
- `font: traditional`
- `fontSize: medium`

### Preview

- The preview updates immediately as content or options change
- Preview columns are initialized from the rendered width, then normalized so the layout still fits a printable page
- Empty state is shown until at least one consonant or vowel is selected
- Vowels are rendered with placeholder-aware formatting so preposed and combining forms preview correctly

### PDF export

- Export uses `jsPDF`
- Output is generated as an `A4` portrait PDF
- The PDF embeds local font assets from `public/fonts/`
- Export progress is surfaced through three phases:
  - `preparing`
  - `generating`
  - `downloading`
- Generated file name: `thai-script-practice.pdf`

## Current limitations

- There is no print action in the current UI; output is PDF download only
- There is no persistence layer or local storage for selections/settings
- There is no backend
- The current font set differs from the original MVP planning docs
- PDF export targets A4 only; paper-size selection remains out of scope for MVP
- Playwright covers browser smoke flows, but broader end-to-end coverage is still in progress

## Verification status

- Vitest covers data, hooks, components, and selected app-level flows
- Playwright smoke coverage exists in `e2e/` for preview updates, download flow, and mobile sanity
- A fresh worktree is not ready for verification until `pnpm install` has been run locally

## Code map

- `src/App.tsx`: app orchestration and PDF export state
- `src/components/ContentSelection.tsx`: consonant and vowel selection UI
- `src/components/SheetOptions.tsx`: worksheet controls
- `src/components/Preview.tsx`: live worksheet preview
- `src/components/OutputActions.tsx`: PDF export action and status
- `src/hooks/useContentSelection.ts`: selection state helpers
- `src/data/`: Thai data, presets, and sheet option helpers
- `src/pdf/downloadPracticePdf.ts`: PDF font loading, layout, drawing, and download

## Historical docs

These files remain useful as background, but they are not the source of truth for current functionality:

- [PRD_01_MVP.md](./PRD_01_MVP.md)
- [MVP_TASKS_TDD.md](./MVP_TASKS_TDD.md)
- [TDD_APPROACH.md](./TDD_APPROACH.md)
