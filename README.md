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

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS
- jsPDF for client-side PDF generation
- Vitest + React Testing Library

## Commands

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm test
pnpm test:run
```

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

`pnpm test:run` executes the current unit and component suite. The repository does not currently include Playwright or any E2E test setup.

## Contributor conventions

- Use Conventional Commits, for example `feat: ...`, `fix: ...`, or `refactor: ...`
- Treat the docs in [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) as the source of truth for shipped behavior

## TDD notes

The implementation follows a Red → Green → Refactor workflow. Historical notes about that process live in [docs/TDD_APPROACH.md](docs/TDD_APPROACH.md) and [docs/MVP_TASKS_TDD.md](docs/MVP_TASKS_TDD.md).
