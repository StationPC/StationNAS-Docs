# Repository Guidelines

## Project Structure & Module Organization

This repository is a bilingual documentation site built with Next.js 16, React 19, and Fumadocs.

- `src/app/`: App Router pages and route handlers. Localized routes live under `src/app/[lang]/`; search, LLM text, and Open Graph endpoints have dedicated route files.
- `src/components/`: shared React/MDX components.
- `src/lib/`: content loading, internationalization, layout options, and utilities.
- `content/docs/en/` and `content/docs/zh/`: English and Chinese MDX documentation. Keep the two language trees structurally aligned.
- `source.config.ts`: Fumadocs collection and MDX configuration.
- `middleware.ts`: locale and content-negotiation middleware.
- `src/app/global.css`: Tailwind and Fumadocs theme imports plus global overrides.

Generated directories such as `.next/` and `.source/` must not be edited manually.

## Build, Test, and Development Commands

Use npm; `package-lock.json` is the committed lockfile.

- `npm install`: install dependencies and generate Fumadocs content metadata.
- `npm run dev`: start the local development server at `http://localhost:3000`.
- `npm run types:check`: regenerate MDX/types and run strict TypeScript checking without emitting files.
- `npm run build`: create a production build and catch routing or rendering failures.
- `npm start`: serve the completed production build.

Before submitting changes, run `npm run types:check` and `npm run build`.

## Coding Style & Naming Conventions

Follow the existing TypeScript/React style: two-space indentation, single quotes, semicolons, and named imports. Use PascalCase for React components, camelCase for functions and variables, and lowercase route-folder names. Prefer the `@/*` alias for imports from `src/`. Keep server components as the default; add client boundaries only when browser state or effects require them.

For documentation, use lowercase kebab-case filenames such as `quick-start/install.mdx`. Update the adjacent `meta.json` when adding, removing, or reordering pages. Mirror substantive content changes in both `en` and `zh` where applicable.

## Testing Guidelines

No automated test framework or coverage threshold is configured. Treat type checking and the production build as required checks. For content or navigation changes, also verify both `/en/docs` and `/zh/docs`, search behavior, internal links, and responsive layout in the browser.

## Commit & Pull Request Guidelines

The repository history is currently minimal, so use short, imperative commit subjects, optionally with a Conventional Commit prefix, for example `docs: add Chinese troubleshooting steps`. Keep each commit focused.

Pull requests should explain the change and validation performed, link any relevant issue, and include screenshots for visual or layout updates. Call out translation gaps, new routes, or configuration changes explicitly.
