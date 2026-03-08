# Run Guide

Last updated: 2026-03-08

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
cp .env.example .env
cp backend/.env.example backend/.env
```

Set at minimum:
- `DATABASE_URL`
- `JWT_SECRET`
- `PORT` (default `3001`)
- `FRONTEND_URL` (default `http://localhost:5173`)
- `REDIS_URL`

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
