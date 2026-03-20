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
- `VITE_API_URL` (for local: `http://localhost:3001`, for prod: your Render URL)

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

## 6) Deploy (Vercel + Render)

Render (Backend):
- Build Command: `cd backend && npm install && npm run build`
- Start Command: `cd backend && npm start`
- Required env vars: `NODE_ENV=production`, `PORT`, `DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ANTHROPIC_API_KEY`

Vercel (Frontend):
- Build Command: `cd frontend && npm run build`
- Output Directory: `frontend/dist`
- Required env vars: `VITE_API_URL` (set to your Render backend base URL)

Important:
- `FRONTEND_URL` supports comma-separated values for multiple allowed origins, e.g. `https://priceiq.vercel.app,https://priceiq-git-main.vercel.app`.
- Backend production entrypoint is compiled JS: `dist/index.js` via `npm start`.

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
