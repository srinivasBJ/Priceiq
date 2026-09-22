# PriceIQ research final report

- Data: `historical_prices.csv` (PRIMARY_HISTORICAL_PRICE_DATA); 7760 rows, 167 products, 2026-06-27T00:00:00 to 2026-09-22T00:00:00.
- Mode: HISTORICAL_PRICE_EVALUATION; valid decision points: 5422; horizon: 7 calendar days.
- Strategies: BUY_NOW, 30_DAY_AVERAGE, EMA_ONLY, 14_OBSERVATION_SLOPE_ONLY, FULL_PRICEIQ.
- Full PriceIQ: unavailable because deterministic production thresholds and precedence are not recoverable.
- LLM explanation status: export-only; no model call determines a decision.
- Temporal leakage: automated causal partition tests passed; runtime eligible points checked: 5422.
- Reproducibility: input hash and run environment are in `run_metadata.json`.
- Supported claim: this run only reports the data quality and pipeline status stated here.
- Unsupported claims: forecasting accuracy, realised savings, and PriceIQ purchase-timing effectiveness.
- Publication blockers: dense genuine history and a versioned authoritative deterministic PriceIQ decision specification.
