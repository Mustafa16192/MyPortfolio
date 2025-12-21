# Repository Guidelines

These notes keep contributors aligned on how this React portfolio is structured, built, and reviewed. Keep guidance short and practical; prefer small, incremental changes.

## Project Structure & Module Organization
- `src/app`: App shell (`App.js`), route transitions (`routes.js`), and global cursor behavior.
- `src/pages`: Individual screens (`home`, `about`, `resume`, `portfolio`, `api`, `contact`) paired with a `style.css` in each folder.
- `src/components`: Reusable UI such as `socialicons` and `themetoggle`.
- `src/content_option.js`: Centralized copy, timelines, skills, and contact config (edit here before touching layout files).
- `src/assets/images`: Portfolio and avatar imagery; keep filenames lowercase with hyphens when adding new assets.
- `public`: Static assets served as-is (favicons, Open Graph preview).

## Build, Test, and Development Commands
Use one package manager per branch; prefer `yarn` because the deploy script calls it.

```bash
yarn install          # install dependencies
yarn start            # CRA dev server at http://localhost:3000 with hot reload
yarn test             # Jest + React Testing Library in watch mode
yarn build            # production build to ./build
yarn predeploy        # build and duplicate index.html to 404.html for static hosting
```

## Coding Style & Naming Conventions
- React 18 + Create React App; follow CRA ESLint defaults (`react-app` / `react-app/jest`).
- Two-space indentation, double quotes, semicolons; keep imports ordered: React/libs → hooks → local components/styles.
- Components/hooks in PascalCase, files matching export (`Home`, `AnimatedCursor`); CSS stays as `style.css` alongside the component folder.
- Keep text/content in `content_option.js` to avoid hardcoding in JSX; prefer prop-driven components over duplicating markup.

## Testing Guidelines
- Tests run via `yarn test`; for CI or coverage use `CI=true yarn test --watch=false --coverage`.
- Co-locate specs as `ComponentName.test.js` near the component or in `__tests__` under the same folder.
- Validate renders, navigation, and key interactions (e.g., route transitions, form submission states); add snapshot tests only for stable UI blocks.

## Commit & Pull Request Guidelines
- History favors concise, present-tense messages (e.g., “update header links”, “fix cursor lag”); aim for one logical change per commit.
- Before opening a PR: run `yarn build` (or at least `yarn test`), note any warnings, and include the commands executed.
- PR description should include: purpose, screenshots for visible UI changes, links to related issues/tasks, and any config/env changes required.

## Security & Configuration Tips
- Do not commit secrets; keep EmailJS keys and similar values in `.env.local` and reference via `process.env`.
- Check external links and social handles in `content_option.js` for accuracy before deploying.
