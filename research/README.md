# PriceIQ research evaluation pipeline

This package is intentionally independent of the frontend/backend. It uses only Python's standard library, imports no production code or secrets, and never modifies production behavior.

## Dataset modes

- `SMOKE_TEST` accepts the sparse canonical starter only to exercise parsing and output generation. Results are never publication-quality.
- `TRANSACTION_ANALYSIS` records a clearly labelled supplementary transaction/snapshot analysis and does not convert it to a price history.
- `HISTORICAL_PRICE_EVALUATION` rejects anything except a dense, repeated, timestamped product-price dataset (at least 21 observations and 21 unique dates under the current quality gate).

## Causal protocol and features

At each decision timestamp `t`, features receive only observations at or before `t`; subsequent observations inside `t < time <= t + 7 days` are used only after decision creation. No missing dates/prices are inserted. A 30-calendar-day reference is the arithmetic mean of observed prices in that lookback, not an assertion of daily observations. The 14-observation OLS slope uses observation index (not invented daily spacing). Historical-low proximity is `(current - historical_low) / historical_low`.

The production repository contains no recoverable EMA alpha, PriceIQ thresholds, target condition, or decision precedence. The prior `FULL_PRICEIQ` guardrail remains `UNAVAILABLE`. Separately, `research/priceiq_engine/` defines **PriceIQ Research v1.0**, a newly specified research methodology—not a recovery of the lost implementation. It fixes EMA alpha at 0.15, calibrates only interpretable thresholds on an explicitly bounded earlier period, freezes them to `research/config/priceiq_v1.yaml`, and evaluates only strictly later points. Baselines are explicit research comparators: `BUY_NOW` always buys; `30_DAY_AVERAGE` buys when current is at/below observed 30-day mean; `EMA_ONLY` buys at/below EMA if an alpha is supplied; and `14_OBSERVATION_SLOPE_ONLY` waits when slope is negative, otherwise buys. They are not production PriceIQ rules.

Ex-post `future_min_7d` and `future_max_7d` are minima/maxima of observed future values inside the horizon. `potential_saving = max(0, current - future_min_7d)` is a counterfactual opportunity if waiting, not a forecast or realised saving. Regret is strategy-conditional: for BUY it is `max(0, current - future_min)`; for WAIT it is `max(0, future_max - current)`. `UNAVAILABLE` has no regret. Opportunity capture is deliberately undefined.

Paired analysis uses product decision points as units. It exports an exploratory paired bootstrap CI only where at least 10 complete pairs exist; no Wilcoxon statistic is fabricated without a validated statistics dependency.

## Commands

```bash
python -m research.main --help
python -m research.experiments.run_audit
python -m research.main --data /Users/trylub/Downloads/priceiq_public_history_starter.csv --mode SMOKE_TEST --horizon 7
python -m research.experiments.run_evaluation --data path/to/genuine_history.csv --mode HISTORICAL_PRICE_EVALUATION --horizon 7
python -m research.experiments.run_baselines --data path/to/genuine_history.csv --mode HISTORICAL_PRICE_EVALUATION
python -m research.experiments.run_ablation --data path/to/genuine_history.csv --mode HISTORICAL_PRICE_EVALUATION
python -m research.experiments.run_llm_explanation_export
python -m research.priceiq_engine.runner --data research/data/historical_prices.csv calibrate --calibration-end 2025-12-31
python -m research.priceiq_engine.runner --data research/data/historical_prices.csv evaluate
python -m unittest discover -s research/tests -v
```

`run_metadata.json` records input filename/hash, counts, range, configuration version, code revision if available, runtime, and horizon. `predictions.csv`, `metrics.csv`, `ablation.csv`, `statistical_summary.csv`, `final_summary.json`, and `FINAL_REPORT.md` are run outputs. Explanation export creates decision-only, numerical-template, and reserved LLM fields; no model can create the decision, and no model is called by this package.
