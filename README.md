# PriceIQ

## Local Development

Terminal 1:
```bash
cd ~/Desktop/priceiq-main && docker compose up -d postgres redis
```

Terminal 2:
```bash
cd ~/Desktop/priceiq-main/backend && npm run dev
```

Terminal 3:
```bash
cd ~/Desktop/priceiq-main/frontend && npm run dev
```

## Production (Vercel + Render)

Backend (Render):
- Build: `cd backend && npm install && npm run build`
- Start: `cd backend && npm start`

Frontend (Vercel):
- Build: `cd frontend && npm run build`
- Output: `frontend/dist`

See `run.md` for required environment variables.
