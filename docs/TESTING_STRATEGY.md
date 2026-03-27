# Testing strategy

This project uses a small testing pyramid with each layer owning a different kind of confidence.

## Levels

- **Data/unit**: `src/data/*.test.ts` verifies domain facts and derived configuration.
- **Hook/state**: `src/hooks/*.test.ts` verifies selection state transitions and preset semantics.
- **Component**: component tests use React Testing Library to verify behavior through roles, labels, text, aria state, and user interaction.
- **App/integration**: `src/App.test.tsx` covers a few cross-component workflows such as presets, config clamping, and PDF export states.
- **Browser smoke**: Playwright covers end-to-end confidence for preview updates, option changes, downloads, and responsive sanity checks.

## What not to lock down in RTL

- Tailwind utility classes unless they are the product requirement.
- Exact DOM wrapper structure used to render a component.
- Exact inline style strings for layout math.
- Internal measurement plumbing used to derive layout.

## Preferred assertions

- Accessible roles, labels, and names.
- Visible text and summary updates.
- `aria-*` state that a user or assistive technology depends on.
- Disabled, busy, error, and success states.
- Public callback inputs and outputs.
