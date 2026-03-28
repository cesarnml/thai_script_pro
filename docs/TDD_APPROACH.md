# How we're building this (TDD in practice)

> Historical process note. This document explains the development approach used during build-out; it is not a current feature spec. For current functionality, see [CURRENT_STATE.md](./CURRENT_STATE.md).

## The loop you'll see

1. **Red** — We write a test that describes the next behavior we want. The test fails (e.g. "THAI_CONSONANTS has 44 items" when the file is empty or doesn't exist).
2. **Green** — We write the smallest amount of code that makes that test pass (e.g. export an array of 44 consonants).
3. **Refactor** — We tidy the code (names, structure) without changing behavior; tests stay green.

Then we repeat for the next behavior. Small steps keep the feedback fast and the design clear.

## Why test first?

- **Specification** — The test is a concrete, runnable spec: "the app has 44 Thai consonants."
- **Design** — Writing the test forces us to choose the API (e.g. `THAI_CONSONANTS` array with `{ id, char, name }`) before implementation.
- **Safety** — Later changes that break the behavior are caught immediately.

## What we're not doing

- We're not testing implementation details (e.g. state variable names).
- We're not writing tests after the fact just for coverage; we use tests to drive what we build.
- We're not making huge steps; each task is one or a few focused tests, then the code to pass them.

## Task list

See [MVP_TASKS_TDD.md](./MVP_TASKS_TDD.md) for the full breakdown. We work in order: Phase 0 (bootstrap) → Phase 1 (data) → Phase 2 (selection) → … → Phase 6 (page + E2E).
