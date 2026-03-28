# PRD 2 slice model

Use this document to shape the second PRD after MVP alignment is complete. The goal is to grow the app through thin vertical slices that are small enough to implement, test, and review without losing code context.

## Gate before writing PRD 2

Do not start feature-expanding PRD work until all of the following are true:

- The MVP contract in [CURRENT_STATE.md](./CURRENT_STATE.md) matches the implementation
- `pnpm install`, `pnpm test:run`, and `pnpm test:e2e` succeed in a fresh worktree
- Playwright covers the main create-preview-download flow and the most important current user paths

## Required slice shape

Every phase 2 slice should include these sections:

- `User outcome`: the user-facing capability unlocked by the slice
- `UI changes`: visible controls, screens, messages, and interaction changes
- `State/data changes`: local state, persistence, derived data, and migrations if any
- `Vitest/RTL acceptance`: the key unit, hook, component, or app tests required
- `Playwright acceptance`: one or two browser flows that prove the slice works end to end

## Recommended PRD 2 slice order

1. `Saved worksheet presets and restore-last-session`
2. `Preview-to-export parity and export UX polish`
3. `Guided practice workflows such as reusable sets or session templates`
4. `New learning content types only after the workflow baseline is stable`

## Slice rules

- Prefer one meaningful user outcome per slice
- Avoid mixing persistence, new content breadth, and broad visual redesign in the same slice
- Keep each slice independently releasable
- Add tests as part of the slice definition of done, not afterward
