# ToLoveList — Agent Guidance

## Project structure

npm workspaces monorepo. **Build order matters**: `shared` must be built before `server`/`client`.

```
shared/     — Zod schemas, TS types, constants (consumed by both server & client)
server/     — Express + Prisma + PostgreSQL backend
client/     — React 19 RC + Vite + Tailwind CSS frontend
```

## Quick commands

| Command | What it does |
|---|---|
| `npm run dev` | Starts server (`tsx watch`) + client (Vite) concurrently |
| `npm run build` | Runs `build` in shared → server → client order |
| `npm run lint` | `tsc --noEmit` across all workspaces |
| `npm run typecheck` | Same as lint (both are `tsc --noEmit`) |
| `npm run dev:server` | Server only (hot-reload via tsx) |
| `npm run dev:client` | Client only (Vite dev server) |
| `npm run build:shared` | Build shared package first when adding to it |
| `npm run db:generate` | Prisma generate |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed categories + questions |
| `npm run db:migrate` | `prisma migrate dev` |
| `npm run db:studio` | Prisma Studio |

No test framework or test files exist.

## Setup

1. `cp .env.example .env` (fill in secrets; `.env` is gitignored)
2. `docker compose up -d postgres` (or provide your own PostgreSQL)
3. `npm run db:push && npm run db:seed`
4. `npm run dev`

## Architecture

- **Server entry**: `server/src/index.ts` — connects to Postgres, auto-seeds categories/questions from hardcoded data, starts Express on `SERVER_PORT` (default 4000).
- **Client entry**: `client/src/main.tsx` → `App.tsx` sets up React Query + auth store hydration from localStorage.
- **API routes** (all under `/api`): auth, profiles, groups, categories, questions, recommendations.
- **Client routing** (React Router v6 `createBrowserRouter`): public routes `/`, `/login`, `/register`; protected routes under `ProtectedRoute` + `AppLayout`.
- **State**: Zustand stores (`authStore`, `groupStore`, `profileStore`, `uiStore`); server data via TanStack React Query.
- **Client API calls**: thin wrappers in `client/src/services/*.ts` using `fetch`, not axios.
- **Vite config**: proxy `/api` → `localhost:4000` in dev; alias `@/` → `client/src/`.
- **Styling**: Tailwind with custom `primary` (purple) and `surface` (slate) color palettes; dark mode by default (`class="dark"` on `<html>`).
- **AI providers**: OpenAI, Anthropic, Gemini, OpenRouter, Ollama. Selected via `AI_PROVIDER` env var (default `openai`). Provider code in `server/src/ai/providers/`.
- **DB**: PostgreSQL via Prisma. Prisma schema uses `@map` for snake_case table names, UUID primary keys.

## Conventions

- `"type": "module"` in all packages — use ESM imports with `.js` extensions in server source.
- **Prettier**: single quotes, semicolons, trailing commas, 100 print width.
- **Zod** for runtime validation on API boundaries (`server/src/middleware/validate.ts`).
- Server follows layered architecture: routes → controllers → services → repositories.
- Client uses `@/` path alias (e.g. `import { api } from '@/services/api'`).
- No linting/formatter scripts run on save or commit — only manual `npm run lint`.
- env vars loaded via `dotenv` at server import (`server/src/config/env.ts`).
