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

## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file. Below is the list of skills that can be used. Each entry includes a name, description, and file path so you can open the source for full instructions when using a specific skill.
### Available skills
- skill-creator: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Codex's capabilities with specialized knowledge, workflows, or tool integrations. (file: /Users/mustafa/.codex/skills/.system/skill-creator/SKILL.md)
- skill-installer: Install Codex skills into $CODEX_HOME/skills from a curated list or a GitHub repo path. Use when a user asks to list installable skills, install a curated skill, or install a skill from another repo (including private repos). (file: /Users/mustafa/.codex/skills/.system/skill-installer/SKILL.md)
### How to use skills
- Discovery: The list above is the skills available in this session (name + description + file path). Skill bodies live on disk at the listed paths.
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill's description shown above, you must use that skill for that turn. Multiple mentions mean use them all. Do not carry skills across turns unless re-mentioned.
- Missing/blocked: If a named skill isn't in the list or the path can't be read, say so briefly and continue with the best fallback.
- How to use a skill (progressive disclosure):
  1) After deciding to use a skill, open its `SKILL.md`. Read only enough to follow the workflow.
  2) When `SKILL.md` references relative paths (e.g., `scripts/foo.py`), resolve them relative to the skill directory listed above first, and only consider other paths if needed.
  3) If `SKILL.md` points to extra folders such as `references/`, load only the specific files needed for the request; don't bulk-load everything.
  4) If `scripts/` exist, prefer running or patching them instead of retyping large code blocks.
  5) If `assets/` or templates exist, reuse them instead of recreating from scratch.
- Coordination and sequencing:
  - If multiple skills apply, choose the minimal set that covers the request and state the order you'll use them.
  - Announce which skill(s) you're using and why (one short line). If you skip an obvious skill, say why.
- Context hygiene:
  - Keep context small: summarize long sections instead of pasting them; only load extra files when needed.
  - Avoid deep reference-chasing: prefer opening only files directly linked from `SKILL.md` unless you're blocked.
  - When variants exist (frameworks, providers, domains), pick only the relevant reference file(s) and note that choice.
- Safety and fallback: If a skill can't be applied cleanly (missing files, unclear instructions), state the issue, pick the next-best approach, and continue.
