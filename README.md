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

## PriceIQ Research v1.0

The repository includes a separately versioned research implementation in
`research/priceiq_engine/`. It is a new deterministic research methodology,
not a reconstruction of the lost original PriceIQ decision engine.

The frozen configuration, calibration protocol, dataset audit, and evaluation
artifacts are available under `research/config/`, `research/priceiq_engine/`,
and `research/results/`. The evaluation uses daily as-of prices derived from
the openly licensed price-change log described in the research report; they
are not independently observed daily marketplace prices.

To run the research test suite:

```bash
python3 -m unittest discover -s research/tests -v
```

To reproduce an evaluation using the frozen configuration:

```bash
python3 -m research.priceiq_engine.runner \
  --data research/data/historical_prices.csv evaluate
```

The evaluation only uses decision timestamps strictly after the frozen
calibration cutoff. See `research/results/FINAL_REPORT.md` for methodology,
calibration, unseen-test, baseline, and ablation results.
