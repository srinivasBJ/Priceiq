# Run Guide

Last updated: 2026-03-20

## Prerequisites
- Node.js 18+
- npm 9+
- PostgreSQL 14+
- Redis 6+

## 1) Install Dependencies
From repo root:

```bash
npm install
```

## 2) Configure Environment
Copy and edit env files:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Set at minimum:
- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `PORT` (default `3001`)
- `FRONTEND_URL` (for local: `http://localhost:5173`, for prod: your Vercel URL)
- `REDIS_URL`
- `ANTHROPIC_API_KEY`
- `VITE_API_URL` (for local: `http://localhost:3001`, for prod: your backend URL)

## 3) Database Setup
```bash
npm run db:migrate
npm run db:seed
```

## 4) Start Development
Use two terminals:

Terminal A:
```bash
npm run dev:be
```

Terminal B:
```bash
npm run dev:fe
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:3001`

## 5) Production Build Checks
Frontend:
```bash
cd frontend && npm run build
```

Backend:
```bash
cd backend && npm run build
```

Backend output: `backend/dist/`
Frontend output: `frontend/dist/`

## 6) Deploy Card-Free (Vercel + Neon + Upstash)

Database:
- PostgreSQL on Neon (free): use pooled connection string as `DATABASE_URL`
- Redis on Upstash (free): use TLS URL as `REDIS_URL` (`rediss://...`)

Backend on Vercel:
- Import repo in Vercel and create project with Root Directory `backend`
- Framework Preset: `Other`
- `backend/vercel.json` routes all requests to Express app in `backend/api/index.ts`
- Environment variables: `NODE_ENV=production`, `DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ANTHROPIC_API_KEY`

Frontend on Vercel:
- Create second Vercel project with Root Directory `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment variable: `VITE_API_URL` (set to backend Vercel URL)

Important:
- `FRONTEND_URL` supports comma-separated values, e.g. `https://priceiq-web.vercel.app,https://priceiq-web-git-main.vercel.app`.
- For local production runtime, backend entrypoint remains `dist/index.js` via `npm start`.

## 7) Desktop Version
- Open frontend URL in Chrome or Edge.
- Use menu -> `Install app` / `Install PriceIQ`.
- This gives a desktop-like app window without changing backend hosting.

## Docker (Optional)
Development compose:
```bash
docker compose up -d
```

Production compose template:
`docker-compose.prod.yml`

## Notes
- Login and signup are available at `/login` and `/signup`.
- Dashboard top-right also exposes Login/Sign Up buttons when not authenticated.
