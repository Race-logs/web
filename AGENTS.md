# Repository Guidelines

## Project Structure & Module Organization
The Vite-powered React app lives in `src`, with `main.tsx` bootstrapping `App.tsx`. Feature UI is grouped under `src/components`, where folders such as `results-table` contain the component, styles, and colocated tests. Shared types sit in `src/entities`, reusable logic in `src/hooks`, and seeded data in `src/initial-results.ts`. Global styles live in `src/styles.css`. The `mock-server/` directory exposes a local REST stub that reads `race_results.json`, and production bundles are emitted to `dist/` after `yarn build`.

## Build, Test, and Development Commands
- `yarn dev` starts the Vite dev server at http://localhost:5173 with hot module reload.
- `yarn mock-server` launches the JSON stub on port 3001; run it alongside `yarn dev` when exercising network flows.
- `yarn build` produces an optimized bundle in `dist/` for deployment checks.
- `yarn typecheck` runs `tsc --noEmit` to catch typing regressions.
- `yarn test` executes Vitest in CI mode; append `--watch` during local iteration.
- `yarn check` runs Biome linting plus a dry-run format check, while `yarn format` rewrites files under `src/`.

## Coding Style & Naming Conventions
Author React components and hooks in TypeScript (`.tsx`/`.ts`) using 2-space indentation, double quotes, and arrow-function components. Use PascalCase for exported React components (`ResultsTable`), camelCase for variables, and prefix hooks with `use` (`useAthleteRaceResults`). Keep feature folders kebab-cased (`search-bar`) and colocate module-specific styles or tests inside them. Run Biome (`yarn check`) before committing so spacing, imports, and stylistic rules stay consistent.
CSS class names follow a Component-scoped BEM variant: use a kebab-cased component name followed by a double underscore and the element (e.g., `CardsList` with an `item` element becomes `cards-list__item`); keep these names consistent in `.css` and JSX.

## Engineering Principles
- Practice clean code: prefer clear names, limit component responsibilities, and delete unused helpers instead of leaving dead code behind.
- Avoid speculative API surface: don’t add options/flags or behaviors that aren’t exercised by the app; keep interfaces minimal until a real use case appears.
- Keep the dependency graph lean: rely on TypeScript, React, and existing utilities before adding packages, and remove any library that no longer provides value.
- Document any new dependency in the PR description with a short justification so reviewers can assess long-term maintenance impact.
- Reach for mocks sparingly: prefer exercising real component interactions and reserve heavy mocking for truly external boundaries.

## Testing Guidelines
Vitest with Testing Library powers unit and interaction tests, configured through `vitest.config.ts` and the `happy-dom` environment. Place test files next to the code under test using the `.test.ts` or `.test.tsx` suffix (e.g., `src/components/search-bar/search-bar.test.tsx`). Prefer behavior-focused assertions (`screen.getByRole`) over implementation details. Execute `yarn test` and ensure any new asynchronous logic has loading and error states covered. Use the mock server or fixture helpers instead of real network calls.

## Commit & Pull Request Guidelines
Commit messages follow the existing short, imperative style (`add happy-dom`, `fix lint errors`). Keep commits focused and avoid mixing lint fixes with feature work. For pull requests, include a concise summary of the change, highlight affected screens or APIs, link any relevant issues, and attach screenshots or GIFs for UI tweaks. Confirm `yarn check`, `yarn typecheck`, and `yarn test` pass before requesting review, and mention any skipped steps explicitly.
