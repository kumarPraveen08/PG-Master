# PG Master

Live site: https://kumarpraveen08.github.io/PG-Master/

A browser app for learning PostgreSQL. **Learn** is a reading path through storage, memory, MVCC, vacuum, WAL, replication, and production troubleshooting. **Practice** is a sequence of SQL exercises with a task, a schema, a query editor, and a result console.

Queries are checked in the browser. There is no database server to install. A correct answer is matched against the exercise pattern and shown with sample rows.

## Run it

```bash
pnpm install
pnpm dev
```

Open the URL Vite prints (usually http://localhost:5173).

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Typecheck and build for production |
| `pnpm preview` | Serve the production build |
| `pnpm lint` | Run Oxlint |

## Using the app

- **Learn** opens the documentation sidebar. Chapters cover internals from pages and tuples through backups and incident checklists.
- **Practice** opens the exercise workspace. Write SQL, run it, and move to the next exercise when it succeeds.
- Drag the dividers between the task, editor, and console. On a phone those panes stack instead.
- Progress is stored in `localStorage`. A reload keeps the current exercise, completed exercises, and which modules are open.
- Finishing the last exercise in a module collapses that module and opens the next one.
- Finishing every exercise unlocks a certificate you can download as a PDF.

## Project layout

```text
src/
  App.tsx                         app shell, mode, and saved progress
  components/AppHeader.tsx        Learn / Practice switch and progress
  components/Sidebar.tsx          docs and exercise navigation
  components/DocsView.tsx         chapter page
  components/ExerciseWorkspace.tsx task, editor, and console
  components/SplitPane.tsx        draggable panes
  components/CertificateModal.tsx completion certificate
  lib/progress.ts                 localStorage load and save
  _data/DocModule.tsx             documentation chapters
  _data/ExcerciseModule.tsx       practice exercises
```

## Adding content

Documentation lives in `src/_data/DocModule.tsx`. Each module has chapters with optional body text, key points, a diagram, terms, commands, and a warning.

Exercises live in `src/_data/ExcerciseModule.tsx`. Each level needs an `id`, teaching text, a task, a schema, a `regex` that accepts a correct query, a success message, a hint, and `mockData` to show in the console. `resultType` is `"data"` when the console should render rows, or `"command"` when the statement returns no rows.

## GitHub Pages

Pushes to `main` build the app and deploy it with GitHub Actions (`.github/workflows/pages.yml`). The production build uses the `/PG-Master/` base path so scripts and styles load on GitHub Pages. Local `pnpm dev` still uses `/`.

In the repository settings, set **Pages** → **Build and deployment** → **Source** to **GitHub Actions** if the first deploy does not start on its own.

## Stack

React 19, TypeScript, Vite, and Tailwind CSS.
