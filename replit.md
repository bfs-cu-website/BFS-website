# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main product is the B&FS (Business & Finance Society) Cotton University website.

## Artifacts

### bfs-website (primary, `/`)
Multi-page React + Vite website for the Business & Finance Society, Cotton University.
- **Pages**: Home, About, Events, Team, Blog, Resources, Join
- **Design**: Navy (#0A2540) + Gold (#C9A227) palette, Inter + Roboto fonts, Framer Motion animations
- **Data**: Static TypeScript data files in `artifacts/bfs-website/src/data/` (events, team, blog, resources, timeline)
- **Dev command**: `pnpm --filter @workspace/bfs-website run dev`

### api-server (`/api`)
Express 5 backend server for B&FS events management.
- **Events API**: CRUD endpoints for events (`/api/events`)
- **Auth API**: Session-based admin authentication (`/api/auth/login`, `/api/auth/logout`, `/api/auth/check`)
- **Auth mechanism**: JWT stored in httpOnly cookie (`admin_session`), 8-hour expiry
- **Storage API**: Object storage for event photo uploads (`/api/storage/uploads/request-url`, `/api/storage/objects/*`)
- **Env vars**: `ADMIN_PASSWORD` (secret), `JWT_SECRET` (shared env), `SESSION_DURATION_HOURS` (shared env, default 8), `DEFAULT_OBJECT_STORAGE_BUCKET_ID` (secret), `PUBLIC_OBJECT_SEARCH_PATHS` (secret), `PRIVATE_OBJECT_DIR` (secret)

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Routing**: wouter
- **Animations**: Framer Motion
- **Icons**: lucide-react, react-icons
- **Forms**: react-hook-form + zod
- **API framework**: Express 5 (api-server only)
- **Database**: PostgreSQL + Drizzle ORM (not used by bfs-website)
- **API codegen**: Orval (from OpenAPI spec, not used by bfs-website)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/bfs-website run dev` — run B&FS website locally
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Content Management

To update content, edit the static data files in `artifacts/bfs-website/src/data/`:
- `events.ts` — add/edit events and field visits
- `team.ts` — update team members and roles
- `blog.ts` — add blog posts (title, category, excerpt, date)
- `resources.ts` — update books, courses, reports, tools
- `timeline.ts` — add to the society history timeline

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
