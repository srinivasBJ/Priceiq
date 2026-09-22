# PriceIQ Research v1.0 calibration protocol

This is a newly defined research protocol. It is not a reconstruction of the lost PriceIQ production implementation.

1. Supply a genuine, canonical longitudinal price CSV. Catalog snapshots and transaction data fail the primary-data gate.
2. Choose and state `--calibration-end YYYY-MM-DD` before running calibration. A calibration case is eligible only when its decision timestamp and its complete seven-calendar-day outcome horizon are at or before that date.
3. Build causal features with observations at or before each decision timestamp only: 30-day observed-price mean, EMA with fixed alpha 0.15, EMA deviation, 14-observation OLS slope, and historical-low proximity. No dates or prices are interpolated.
4. For each feature, deduplicate the calibration values and take five equally spaced empirical cut points across that support (minimum, quartiles of unique support, and maximum). Candidate thresholds are therefore values observed in calibration cases only. Frequency-weighted rows are not used to form cut points, so carried-forward unchanged prices cannot collapse all candidates to the modal value.
5. A feature with fewer than two distinct empirical cut points is non-discriminating and has only the explicit `disabled` candidate. Otherwise its candidates are every ordered pair of empirical cut points for EMA and slope, or every empirical cut point for historical-low proximity, plus `disabled`. A disabled feature removes only its predicate from the fixed decision precedence; it never receives a numerical fallback.
6. Select the candidate set with highest mean calibration score. The calibration oracle is `BUY` where no lower observed price appears in the next horizon, otherwise `WAIT`. Research `BUY` maps to BUY; `WAIT` and `AVOID` map to WAIT; `WATCH` receives a neutral score of 0.5. Ties prefer greater actionable coverage, then a deterministic lexical threshold ordering, with disabled after numeric empirical values.
7. Bind selected thresholds, disabled-feature flags, cutoff, calibration dataset SHA-256, case count, candidate counts, objective, and score into `research/config/priceiq_v1.yaml` and `priceiq_v1_calibration.json`. Its configuration SHA-256 is recorded in `run_metadata.json`.
8. Evaluate only decision timestamps strictly after the frozen cutoff. The test partition is never used to create candidate values, select thresholds, or resolve ties.

Research decision precedence is: optional target condition → BUY; elevated versus EMA with upward slope → AVOID; favourable versus EMA, near historical low, and not strongly falling → BUY; downward slope while not near low → WAIT; otherwise WATCH.

The configuration remains `REQUIRES_CALIBRATION` until a genuine historical dataset is supplied. No publication result is emitted from the supplied sparse/snapshot data.
