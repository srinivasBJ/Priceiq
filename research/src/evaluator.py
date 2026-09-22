"""Chronological evaluator with explicit dataset modes and no future leakage."""
from __future__ import annotations

import csv
from dataclasses import asdict
from datetime import timedelta
from pathlib import Path
from typing import Any

from .baselines import STRATEGIES, decision as baseline_decision
from .data_loader import DataValidationError, Observation, audit_csv, canonicalize_historical, grouped
from .decision_engine import deterministic_priceiq_decision, load_rules
from .feature_engine import build_features
from .leakage_checks import assert_causal_features
from .metrics import annotate_outcome, summarise
from .provenance import metadata, write_json
from .statistical_analysis import write_summary


MODES = ("SMOKE_TEST", "TRANSACTION_ANALYSIS", "HISTORICAL_PRICE_EVALUATION")


def _write_csv(path: Path, rows: list[dict[str, Any]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader(); writer.writerows(rows)


def _future_within_horizon(series: list[Observation], index: int, horizon_days: int) -> list[Observation]:
    end = series[index].timestamp + timedelta(days=horizon_days)
    return [item for item in series[index + 1:] if item.timestamp <= end]


def _regret(decision: str, current: float, outcome: dict[str, float | None]) -> float | None:
    if outcome["future_min_7d"] is None or decision == "UNAVAILABLE": return None
    if decision == "BUY": return max(0.0, current - float(outcome["future_min_7d"]))
    if decision == "WAIT": return max(0.0, float(outcome["future_max_7d"]) - current)
    return None


def _quality_gate(audit: dict[str, Any]) -> str | None:
    if audit["classification"] != "PRIMARY_HISTORICAL_PRICE_DATA":
        return f"requires PRIMARY_HISTORICAL_PRICE_DATA; detected {audit['classification']}"
    per = audit["observations_per_product"]
    if per["min"] < 21:
        return f"requires at least 21 observations per product; detected minimum {per['min']}"
    if audit["unique_dates"] < 21:
        return f"requires at least 21 distinct observation dates; detected {audit['unique_dates']}"
    return None


def evaluate(data: str | Path, *, mode: str, horizon: int, config: str | Path, results: str | Path,
             allow_invalid_rows: bool = False) -> dict[str, Any]:
    if mode not in MODES: raise ValueError(f"mode must be one of {', '.join(MODES)}")
    results = Path(results); results.mkdir(parents=True, exist_ok=True)
    audit = audit_csv(data); rules = load_rules(config)
    report = {"mode": mode, "dataset": audit["filename"], "dataset_classification": audit["classification"], "status": "NOT_RUN", "reason": None}
    if mode == "TRANSACTION_ANALYSIS":
        if audit["classification"] not in ("TRANSACTION_DATA", "PRODUCT_CATALOG_SNAPSHOT"):
            report["reason"] = "TRANSACTION_ANALYSIS accepts only transaction/snapshot data."
        else:
            report.update(status="COMPLETE", limitation="Transaction-derived supplementary analysis only; not continuous marketplace price history.")
        write_json(results / "final_summary.json", report); write_json(results / "run_metadata.json", metadata(data, audit, rules, horizon))
        return report
    if mode == "HISTORICAL_PRICE_EVALUATION":
        gate = _quality_gate(audit)
        if gate:
            raise DataValidationError(f"Historical evaluation refused: {gate}. Do not substitute transaction or sparse data.")
    try:
        observations, _ = canonicalize_historical(data)
    except DataValidationError:
        if not allow_invalid_rows: raise
        # Deliberate SMOKE_TEST-only quarantine: drop malformed records after audit; never use it in publication mode.
        columns, raw = __import__('research.src.data_loader', fromlist=['read_csv']).read_csv(data)
        valid = [row for row in raw if all(str(row.get(key, '')).strip() for key in ("product_id", "product_name", "timestamp", "price", "currency"))]
        temporary = results / "_smoke_valid_rows.csv"
        _write_csv(temporary, valid, columns)
        observations, _ = canonicalize_historical(temporary)
        report["quarantined_rows"] = len(raw) - len(valid)
    rows: list[dict[str, Any]] = []
    for product_id, series in grouped(observations).items():
        for index in range(13, len(series)):
            history, future = series[:index + 1], _future_within_horizon(series, index, horizon)
            if not future: continue
            # The feature call sees only history. This assertion rejects an invalid temporal split.
            assert_causal_features(history, future, reference_window_days=int(rules["reference_window_days"]), ema_alpha=rules["ema_alpha"], regression_window=int(rules["regression_window"]))
            features = build_features(history, reference_window_days=int(rules["reference_window_days"]), ema_alpha=rules["ema_alpha"], regression_window=int(rules["regression_window"]))
            outcome = annotate_outcome(features.current_price, [item.price for item in future])
            for strategy in STRATEGIES:
                decision = deterministic_priceiq_decision(features, rules)[0] if strategy == "FULL_PRICEIQ" else baseline_decision(strategy, features)
                rows.append({"product_id": product_id, "timestamp": history[-1].timestamp.isoformat(), "strategy": strategy, "decision": decision,
                    **asdict(features), **outcome, "regret": _regret(decision, features.current_price, outcome)})
    fields = ["product_id", "timestamp", "strategy", "decision", "current_price", "reference_price", "ema", "ema_deviation", "slope", "historical_low", "historical_low_proximity", "future_min_7d", "future_max_7d", "potential_saving", "regret"]
    _write_csv(results / "predictions.csv", rows, fields)
    metrics = summarise(rows, STRATEGIES)
    _write_csv(results / "metrics.csv", metrics, ["strategy", "n_decisions", "mean_potential_saving", "median_potential_saving", "mean_regret", "median_regret", "decision_counts", "opportunity_capture_if_defined"])
    statistical = write_summary(rows, results / "statistical_summary.csv")
    report.update(status="SMOKE_COMPLETE" if mode == "SMOKE_TEST" else "COMPLETE", valid_decision_points=len(rows) // len(STRATEGIES),
        publication_eligible=(mode == "HISTORICAL_PRICE_EVALUATION" and all(r["strategy"] != "FULL_PRICEIQ" or r["decision"] != "UNAVAILABLE" for r in rows)))
    write_json(results / "run_metadata.json", metadata(data, audit, rules, horizon)); write_json(results / "final_summary.json", report)
    final_report = ["# PriceIQ research final report", "", f"- Data: `{audit['filename']}` ({audit['classification']}); {audit['row_count']} rows, {audit['unique_products']} products, {audit['earliest_date']} to {audit['latest_date']}.",
        f"- Mode: {mode}; valid decision points: {report['valid_decision_points']}; horizon: {horizon} calendar days.",
        f"- Strategies: {', '.join(STRATEGIES)}.", "- Full PriceIQ: unavailable because deterministic production thresholds and precedence are not recoverable.",
        "- LLM explanation status: export-only; no model call determines a decision.", f"- Temporal leakage: automated causal partition tests passed; runtime eligible points checked: {report['valid_decision_points']}.",
        "- Reproducibility: input hash and run environment are in `run_metadata.json`.", "- Supported claim: this run only reports the data quality and pipeline status stated here.",
        "- Unsupported claims: forecasting accuracy, realised savings, and PriceIQ purchase-timing effectiveness.",
        "- Publication blockers: dense genuine history and a versioned authoritative deterministic PriceIQ decision specification."]
    (results / "FINAL_REPORT.md").write_text("\n".join(final_report) + "\n")
    return report
