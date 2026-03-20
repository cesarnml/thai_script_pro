# Thai Script Pro

Web app for generating customizable Thai script practice sheets (consonants and vowels). Select content, set options, preview, and print or download as PDF.

See [docs/PRD_01_MVP.md](docs/PRD_01_MVP.md) for the product spec and [docs/MVP_TASKS_TDD.md](docs/MVP_TASKS_TDD.md) for the TDD task breakdown. [docs/TDD_APPROACH.md](docs/TDD_APPROACH.md) explains the Red → Green → Refactor loop used in this project.

## Stack

- React 19 + TypeScript
- Vite, PNPM
- TailwindCSS
- Vitest + React Testing Library (component/unit), Playwright (E2E, to be added)

## Commands

```bash
pnpm install   # install dependencies
pnpm dev       # start dev server (http://localhost:5173)
pnpm build     # production build
pnpm preview   # preview production build
pnpm test      # run Vitest in watch mode
pnpm test:run  # run Vitest once
```

## Contributor conventions

- Use Conventional Commit style for git commit messages, for example `feat: ...`, `fix: ...`, `refactor: ...`.

## Project layout

- `src/data/` — Thai consonants, vowels, sheet options (constants + unit tests)
- `src/hooks/` — `useContentSelection` (selection state)
- `src/components/` — ContentSelection, SheetOptions, Preview, OutputActions
- `src/App.tsx` — single-page composition with lifted state

## TDD flow used

1. **Red** — Write a failing test for the next behavior.
2. **Green** — Implement the minimum code to pass.
3. **Refactor** — Tidy without changing behavior; keep tests green.

Tests were written first (or in lockstep) for data, hooks, and components so the suite documents and guards behavior.
