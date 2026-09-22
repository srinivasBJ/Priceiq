# PriceIQ Research v1.0 final report

## Historical facts

The original deterministic PriceIQ implementation and thresholds are lost. This evaluation does not recover or claim to be that implementation.

## Newly defined methodology

PriceIQ Research v1.0 uses a 30-day reference price, EMA alpha 0.15, a 14-observation OLS slope, historical-low proximity, optional target condition, and fixed deterministic precedence. The input is daily as-of prices derived from an openly licensed append-only price-change log by carrying each recorded price forward until the next recorded change.

## Calibration results

Calibration used only cases at or before 2026-08-15: 2718 cases and 726 empirical candidate configurations. EMA was disabled by the optimizer. The frozen configuration hash is `0f0c8277e6f36ab6ec09d4d74c8e4bcdf949cd46499fb436a2bfb9c5a22df4af`.

## Unseen test results

Only 2039 timestamps strictly after 2026-08-15 were evaluated. The V1 results and same-point baseline comparisons are in `metrics.csv`; paired exploratory bootstrap comparisons are in `statistical_summary.csv`.

## Ablation

Each ablation applies the frozen configuration on the unseen partition and disables one feature predicate. Results are in `ablation.csv`.
