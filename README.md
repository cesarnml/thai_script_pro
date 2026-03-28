# Thai Script Pro

Thai Script Pro is a Vite + React app for generating printable Thai handwriting practice sheets. Users can choose consonants and vowels, adjust worksheet layout options, preview the result live, and download the worksheet as a PDF.

For the implemented product and current constraints, start with [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md). The planning docs in `docs/` are still useful background, but they describe earlier MVP intent rather than the exact shipped behavior.

## Current feature set

- Select from all 44 Thai consonants
- Select from 28 vowel forms
- Apply consonant presets by class group:
  - Low Class Group 1
  - Low Class Group 2
  - Middle Class
  - High Class
- Apply vowel presets:
  - Short vowels
  - Long vowels
- Configure worksheet layout:
  - Rows per character: `1` to `8`
  - Columns: auto-constrained by font size and printable page width
  - Ghost copies per row
  - Grid guide: `Cross`, `Sandwich`, `Thai`
  - Font: `Traditional`, `Modern`, `Cursive`
  - Font size: `Small`, `Medium`, `Large`
- Preview the worksheet before export
- Download an A4 PDF with embedded Thai-capable fonts and progress feedback

## MVP contract

The active MVP in this repo is intentionally narrower than the original historical planning docs:

- Output is `PDF download` only
- Paper size is fixed to `A4`
- The shipped font set is `Traditional`, `Modern`, and `Cursive`
- Expanding scope for phase 2 is blocked until MVP docs, tests, and E2E coverage are aligned

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- jsPDF for client-side PDF generation
- Vitest + React Testing Library

## Commands

```bash
pnpm install   # required first step in a fresh worktree
pnpm format    # apply Prettier formatting
pnpm format:check  # verify formatting without changing files
pnpm lint      # run ESLint
pnpm lint:fix  # run ESLint with autofixes
pnpm check     # run formatting, lint, tests, and build
pnpm dev       # start dev server (http://localhost:5173)
pnpm build     # production build
pnpm preview   # preview production build
pnpm test      # run Vitest in watch mode
pnpm test:run  # run Vitest once
pnpm test:e2e:install  # install the local Chromium runtime for Playwright
pnpm test:e2e  # run Playwright smoke tests
```

Playwright local setup:

```bash
pnpm install
pnpm test:e2e:install
pnpm test:e2e
```

## Fresh worktree bootstrap

When you create a new ephemeral worktree, run `pnpm install` before drawing conclusions from failed checks. Until dependencies exist locally, `pnpm test:run`, `pnpm build`, and `pnpm test:e2e` will fail for environment reasons rather than product reasons.

Recommended personal workflow:

- Use a local wrapper, alias, or script for worktree creation that immediately runs `pnpm install`
- Keep this as personal automation, not repo logic
- Use this repo verification order in every new worktree: `pnpm install`, `pnpm test:run`, `pnpm test:e2e`

The dev server runs at [http://localhost:5173](http://localhost:5173) by default.

## Project layout

- `src/App.tsx` wires together app state, preview, toast messaging, and PDF export flow
- `src/components/` contains the main UI sections: selection, options, preview, and output actions
- `src/data/` contains Thai character data, presets, and sheet configuration helpers
- `src/hooks/` contains `useContentSelection`
- `src/pdf/` contains PDF layout and font registration logic
- `public/fonts/` contains the Thai fonts embedded into exported PDFs
- `docs/` contains planning notes plus current-state documentation

## Testing

`pnpm test:run` executes the current unit and component suite. `pnpm test:e2e` runs the Playwright smoke test in `e2e/`.

## CI and quality gates

GitHub Actions runs formatting, linting, tests, and build checks for pull requests and pushes to `main`.
To block merges until those checks pass, configure a branch protection rule or ruleset on `main` and require the `quality` status check.

## Contributor conventions

- Use Conventional Commits, for example `feat: ...`, `fix: ...`, or `refactor: ...`
- Treat the docs in [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) as the source of truth for shipped behavior

## TDD notes

The implementation follows a Red → Green → Refactor workflow. Historical notes about that process live in [docs/TDD_APPROACH.md](docs/TDD_APPROACH.md) and [docs/MVP_TASKS_TDD.md](docs/MVP_TASKS_TDD.md).
