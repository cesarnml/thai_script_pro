# MVP task breakdown (TDD)

> Historical planning document. This checklist tracks the original MVP plan and now diverges from the implemented app in a few areas. For the current product state, see [CURRENT_STATE.md](./CURRENT_STATE.md).

Small chunks for Test-Driven Development. Each task follows **Red** (write failing test) → **Green** (minimal code to pass) → **Refactor** (clean up). This doc maps to [PRD_01_MVP.md](./PRD_01_MVP.md).

---

## TDD in one sentence

**Write a failing test that describes the behavior you want, then write the smallest code that makes it pass, then improve the code without changing behavior.**

---

## Phase 0: Bootstrap project

| Task    | What to do                                                                               | TDD note                                                                                         |
| ------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **0.1** | Create Vite + React + TypeScript project with pnpm                                       | No test first; scaffold only.                                                                    |
| **0.2** | Add TailwindCSS and basic config                                                         | No test first.                                                                                   |
| **0.3** | Add Vitest, jsdom, @testing-library/react, @testing-library/user-event; config for React | **Test first:** one dummy component test that renders and asserts text; then ensure Vitest runs. |
| **0.4** | Add Playwright (optional now; use later for E2E)                                         | Can defer.                                                                                       |
| **0.5** | Add Shadcn/Base UI (when first needed)                                                   | Defer until we build UI components.                                                              |

---

## Phase 1: Data and constants (unit tests only)

Pure data and config—no UI. We test **logic and structure** with Vitest.

| Task    | What to test (write first)                                                            | What to implement                                                  |
| ------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **1.1** | `THAI_CONSONANTS` has length 44; each item has `id`, `char`, optional `name`          | Define `THAI_CONSONANTS` array (e.g. in `src/data/consonants.ts`). |
| **1.2** | `THAI_VOWELS` exists; each item has `id`, `char` (or similar); count as per PRD (~32) | Define `THAI_VOWELS` in `src/data/vowels.ts`.                      |
| **1.3** | Grid guide options: exactly 3 (Cross, Sandwich, Thai)                                 | `GRID_GUIDE_OPTIONS` in `src/data/sheetOptions.ts`.                |
| **1.4** | Font options: 5 fonts; default is Noto Serif Thai                                     | `FONT_OPTIONS` and default in `sheetOptions.ts`.                   |
| **1.5** | Font size options: Small / Medium / Large (or 18/24/32pt); default                    | `FONT_SIZE_OPTIONS` and default.                                   |
| **1.6** | Paper size: at least A4, optional Letter                                              | `PAPER_SIZE_OPTIONS` and default.                                  |
| **1.7** | Default sheet config object: rows per character (e.g. 2), ghost copies (e.g. 3)       | `DEFAULT_SHEET_CONFIG` and type `SheetConfig`.                     |

---

## Phase 2: Content selection (component TDD)

Selection state and UI. We test **behavior**: what the user sees and what happens when they click.

| Task    | What to test (write first)                                                            | What to implement                                               |
| ------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| **2.1** | Hook or util: initial state = no consonants/vowels selected; toggle adds/removes id   | `useContentSelection` or `selectionReducer` + tests.            |
| **2.2** | “Select all consonants” sets all 44; “Clear consonants” sets 0                        | Extend hook/util; test in isolation (unit test).                |
| **2.3** | Same for vowels: Select all / Clear                                                   | Same pattern for vowels.                                        |
| **2.4** | Component renders section “Consonants” and list of consonant items (by role or label) | `ContentSelection.tsx`: show consonants from `THAI_CONSONANTS`. |
| **2.5** | Clicking a consonant toggles selection (visual or aria state)                         | Wire toggle to state; assert selection count or state.          |
| **2.6** | Component shows “Vowels” and vowel items; toggle works                                | Add vowels to `ContentSelection`.                               |
| **2.7** | Button “Select all” (consonants) → summary shows “44 consonants” (or equivalent)      | Add Select all button; assert summary text.                     |
| **2.8** | Button “Clear” (consonants) → summary shows “0 consonants”                            | Add Clear button for consonants.                                |
| **2.9** | Select all / Clear for vowels; summary shows “X consonants, Y vowels selected”        | Same for vowels; unified summary.                               |

---

## Phase 3: Sheet options form (component TDD)

Form controls for sheet configuration. Test **that controls exist and that changing them updates state**.

| Task    | What to test (write first)                                                                                | What to implement                                    |
| ------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **3.1** | Component receives `config` and `onChange`; changing “Rows per character” calls `onChange` with new value | `SheetOptions.tsx`: number input or select for rows. |
| **3.2** | “Ghost copies per row” control; onChange with new value                                                   | Add control; test.                                   |
| **3.3** | Paper size dropdown: options A4, Letter; onChange                                                         | Dropdown from `PAPER_SIZE_OPTIONS`.                  |
| **3.4** | Grid guide dropdown: 3 options; onChange                                                                  | Dropdown from `GRID_GUIDE_OPTIONS`.                  |
| **3.5** | Font dropdown: 5 options; default selected; onChange                                                      | Font dropdown; default from constants.               |
| **3.6** | Font size dropdown: Small/Medium/Large (or pt); onChange                                                  | Font size dropdown.                                  |

---

## Phase 4: Preview (component TDD)

Preview area that reflects selection and options. Test **that it receives props and re-renders**, not pixel-perfect layout.

| Task    | What to test (write first)                                                                                    | What to implement                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **4.1** | Preview renders a region (e.g. “Preview” or role="region") and shows something when given selected consonants | `Preview.tsx`: takes `selectedConsonants`, `selectedVowels`, `config`; render placeholder. |
| **4.2** | When `selectedConsonants` changes, preview content updates (e.g. character count or first char)               | Assert content reflects new selection.                                                     |
| **4.3** | When `config` (e.g. rows per character) changes, preview reflects it (e.g. more rows)                         | Assert preview uses config.                                                                |
| **4.4** | Preview shows correct grid guide and font (e.g. class or data attribute from config)                          | Apply grid and font from config.                                                           |

---

## Phase 5: Output (Print + PDF)

Buttons and handlers; mock print and PDF in tests.

| Task    | What to test (write first)                                                                | What to implement                                                  |
| ------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **5.1** | “Print” and “Download PDF” buttons are present (by role or text)                          | `OutputActions.tsx`: two buttons.                                  |
| **5.2** | Click “Print” calls `window.print` (mock `window.print`, assert called)                   | `onPrint` handler.                                                 |
| **5.3** | Click “Download PDF” triggers download (mock PDF lib / blob; assert download or callback) | PDF generation (e.g. jsPDF or browser print-to-PDF); mock in test. |
| **5.4** | PDF content uses current selection and sheet config (integration or unit test with mock)  | Pass selection + config into PDF generator.                        |

---

## Phase 6: Single page and E2E

Lift state to one place; one happy-path E2E.

| Task    | What to test (write first)                                                                                | What to implement                                                  |
| ------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **6.1** | App page renders ContentSelection, SheetOptions, Preview, OutputActions                                   | `App.tsx`: compose sections; state in parent or context.           |
| **6.2** | Changing selection updates preview; changing options updates preview                                      | Integration: RTL or E2E that changes controls and asserts preview. |
| **6.3** | Playwright: open app → select some consonants → change options → see preview → click Print (mock or real) | One E2E test for critical path.                                    |

---

## Order of work (summary)

1. **Phase 0** – Bootstrap (one RTL sanity test).
2. **Phase 1** – Data/constants (unit tests only; no UI).
3. **Phase 2** – Content selection (state + component, test each behavior).
4. **Phase 3** – Sheet options form (one control at a time).
5. **Phase 4** – Preview (props → render → update).
6. **Phase 5** – Output (buttons + mocks).
7. **Phase 6** – Page composition + one E2E.

Within each task: **Red** (add or run failing test) → **Green** (implement until pass) → **Refactor** (clean up, re-run tests).
