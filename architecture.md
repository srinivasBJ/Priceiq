# PriceIQ Architecture

Last updated: 2026-03-08

## Repository Snapshot
- Total tracked workspace files: `83`
- Source files (`frontend/src`, `backend/src`, `shared`): `64`
- Empty source files: `0`

## High-Level System
PriceIQ is a full-stack TypeScript monorepo with a React/Vite frontend and an Express backend.

- Frontend: SPA for dashboard, analytics, catalog search, compare, deals, wishlist, and price tracker.
- Backend: REST API with auth, product/rules/alerts modules, and Prisma persistence.
- Shared workspace: placeholder package for cross-project TS config/types.

## Runtime Components
1. Frontend (`/frontend`)
- Built with `React 18 + Vite`.
- Uses `react-router` for route-level screens.
- Uses `zustand` for auth state and localStorage-backed wishlist/tracker state.
- Route-level lazy loading is enabled in `frontend/src/App.tsx`.

2. Backend (`/backend`)
- Built with `Express 5 + TypeScript`.
- Uses Prisma for DB access and schema migrations (`backend/prisma`).
- Includes auth middleware and module-based route registration.

3. Data Sources
- Live API-backed modules exist for auth/products/rules/alerts.
- Current catalog/compare/wishlist/tracker UI is powered by a shared static catalog source:
  `frontend/src/lib/deviceCatalog.ts`.

## Frontend Structure
- Entry: `frontend/src/main.tsx`
- App/router: `frontend/src/App.tsx`
- Layout shell/navigation: `frontend/src/components/layout/AppLayout.tsx`
- Main pages: `frontend/src/pages/*`
- Catalog data model/helpers: `frontend/src/lib/deviceCatalog.ts`

### Key UX Flows
1. Search catalog -> add to wishlist (`piq_wishlist`) or tracker (`piq_tracked`).
2. Wishlist reads from same device catalog and supports target price (`piq_targets`).
3. Tracker reads tracked items and renders synthetic 14-day trend charts.
4. Compare tries exact/strong/fuzzy Amazon-link matching against catalog entries.

## Backend Structure
- Server bootstrap: `backend/src/index.ts`, `backend/src/app.ts`
- Config: `backend/src/config/*`
- Modules: `backend/src/modules/*`
- Middleware: `backend/src/middleware/*`
- Prisma schema/migrations: `backend/prisma/*`

## Request Path (Typical)
1. Browser hits frontend route.
2. Frontend state/UI resolves page behavior.
3. API calls (where implemented) go via Axios client to backend `/api/v1/*`.
4. Backend middleware validates/authenticates request.
5. Controller -> service -> Prisma (if persistence needed) -> response.

## Current Constraints
- Compare from arbitrary Amazon `dp` links is best-effort (closest catalog match) unless full product text is present in URL.
- Catalog data is currently local static data, not yet DB-backed.

## Recommended Next Architecture Step
Move `deviceCatalog` into backend persistence and expose `GET /catalog/search` + `GET /catalog/:id` APIs, so all pages use one API source of truth.
