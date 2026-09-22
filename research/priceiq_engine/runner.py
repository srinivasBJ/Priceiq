"""Calibrate then evaluate PriceIQ Research v1.0 on a strictly later test period."""
from __future__ import annotations

import argparse
import csv
import json
from dataclasses import asdict
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any

from research.src.data_loader import DataValidationError, audit_csv, canonicalize_historical, grouped
from research.src.feature_engine import build_features
from research.src.metrics import annotate_outcome, summarise
from research.src.provenance import metadata, write_json
from .calibration import calibrate, calibration_cases
from .config import configuration_hash, is_frozen, load, write
from .decision import decide


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_DATA = ROOT / "data" / "historical_prices.csv"
DEFAULT_CONFIG = ROOT / "config" / "priceiq_v1.yaml"


def _parse_date(value: str) -> datetime:
    try: return datetime.strptime(value, "%Y-%m-%d")
    except ValueError as error: raise ValueError("--calibration-end must be YYYY-MM-DD") from error


def _gate(audit: dict[str, Any]) -> None:
    if audit["classification"] != "PRIMARY_HISTORICAL_PRICE_DATA":
        raise DataValidationError(f"PriceIQ Research v1.0 requires genuine PRIMARY_HISTORICAL_PRICE_DATA; found {audit['classification']}. Catalog snapshots and transaction datasets are rejected.")
    if audit["observations_per_product"]["min"] < 21 or audit["unique_dates"] < 21:
        raise DataValidationError("PriceIQ Research v1.0 requires at least 21 observations per product and 21 unique dates; no missing dates are fabricated.")


def _write_csv(path: Path, rows: list[dict[str, Any]], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader(); writer.writerows(rows)


def freeze(data: str | Path, calibration_end: str, config_path: str | Path, results: str | Path) -> dict[str, Any]:
    audit = audit_csv(data); _gate(audit)
    observations, _ = canonicalize_historical(data)
    template = load(config_path)
    cutoff = _parse_date(calibration_end)
    cases = calibration_cases(observations, cutoff, template)
    frozen, report = calibrate(cases, template)
    frozen["calibration_end"] = calibration_end
    frozen["calibration_dataset_hash"] = audit["sha256"]
    write(config_path, frozen)
    report.update({"methodology": "PriceIQ Research v1.0", "calibration_end": calibration_end, "dataset_hash": audit["sha256"], "config_path": str(Path(config_path).resolve()), "configuration_hash": configuration_hash(config_path)})
    results = Path(results); results.mkdir(parents=True, exist_ok=True)
    write_json(results / "priceiq_v1_calibration.json", report)
    run_metadata = metadata(data, audit, frozen, int(frozen["evaluation_horizon_days"]), report["configuration_hash"])
    run_metadata["calibration"] = report
    write_json(results / "run_metadata.json", run_metadata)
    return report


def _future(series: list[Any], index: int, horizon: int) -> list[Any]:
    end = series[index].timestamp + timedelta(days=horizon)
    return [item for item in series[index + 1:] if item.timestamp <= end]


def _regret(label: str, current: float, outcome: dict[str, float | None]) -> float | None:
    if outcome["future_min_7d"] is None: return None
    if label == "BUY": return max(0.0, current - float(outcome["future_min_7d"]))
    if label in ("WAIT", "AVOID"): return max(0.0, float(outcome["future_max_7d"]) - current)
    return None  # WATCH has no forced purchase action, so its regret is deliberately undefined.


def evaluate_unseen(data: str | Path, config_path: str | Path, results: str | Path) -> dict[str, Any]:
    audit = audit_csv(data); _gate(audit)
    config = load(config_path)
    if not is_frozen(config): raise DataValidationError("PriceIQ Research v1.0 configuration is not frozen. Run calibration first; evaluation cannot tune thresholds.")
    if config["calibration_dataset_hash"] != audit["sha256"]:
        raise DataValidationError("Frozen configuration was calibrated on a different dataset hash; recalibrate explicitly or supply the matching historical dataset.")
    observations, _ = canonicalize_historical(data)
    cutoff = _parse_date(str(config["calibration_end"])); horizon = int(config["evaluation_horizon_days"])
    rows = []
    for product_id, series in grouped(observations).items():
        for index in range(int(config["regression_window"]) - 1, len(series)):
            current, future = series[index], _future(series, index, horizon)
            if current.timestamp <= cutoff or not future: continue  # strict unseen later period
            features = build_features(series[:index + 1], reference_window_days=int(config["reference_window_days"]), ema_alpha=float(config["ema_alpha"]), regression_window=int(config["regression_window"]))
            result = decide(features, config); outcome = annotate_outcome(features.current_price, [item.price for item in future])
            rows.append({"product_id": product_id, "timestamp": current.timestamp.isoformat(), "strategy": "PRICEIQ_RESEARCH_V1", "decision": result.label, "reasons": " | ".join(result.reasons), **asdict(features), **outcome, "regret": _regret(result.label, features.current_price, outcome)})
    results = Path(results); results.mkdir(parents=True, exist_ok=True)
    fields = ["product_id", "timestamp", "strategy", "decision", "reasons", "current_price", "reference_price", "ema", "ema_deviation", "slope", "historical_low", "historical_low_proximity", "target_condition", "future_min_7d", "future_max_7d", "potential_saving", "regret"]
    _write_csv(results / "priceiq_v1_predictions.csv", rows, fields)
    metrics = summarise(rows, ("PRICEIQ_RESEARCH_V1",))
    _write_csv(results / "priceiq_v1_metrics.csv", metrics, ["strategy", "n_decisions", "mean_potential_saving", "median_potential_saving", "mean_regret", "median_regret", "decision_counts", "opportunity_capture_if_defined"])
    report = {"methodology": "PriceIQ Research v1.0", "status": "COMPLETE", "historical_facts": "Original deterministic engine and thresholds are lost; no recovery attempted.", "new_methodology": "New fixed features with calibrated, frozen thresholds; not the original implementation.", "calibration_results": {"calibration_end": config["calibration_end"], "calibration_score": config["calibration_score"], "configuration_hash": configuration_hash(config_path)}, "unseen_test_results": {"n_decision_points": len(rows), "test_rule": f"timestamp strictly after {config['calibration_end']}"}, "publication_eligible": True}
    write_json(results / "priceiq_v1_final_summary.json", report)
    report_lines = ["# PriceIQ Research v1.0 final report", "", "## Historical facts", "", "The original PriceIQ deterministic engine and catalog are lost. This run does not recover, reconstruct, or claim to be that implementation.", "", "## Newly defined methodology", "", "PriceIQ Research v1.0 uses a 30-day observed-price reference, EMA alpha 0.15, a 14-observation OLS slope, historical-low proximity, optional target condition, and calibrated deterministic thresholds.", "", "## Calibration results", "", f"Calibration ended on {config['calibration_end']}; frozen configuration SHA-256: `{configuration_hash(config_path)}`; calibration score: {config['calibration_score']}.", "", "## Unseen test results", "", f"Only decision points strictly later than {config['calibration_end']} were evaluated. Valid test decision points: {len(rows)}.", "", "This is a research evaluation, not a claim about the lost original implementation."]
    (results / "PRICEIQ_V1_FINAL_REPORT.md").write_text("\n".join(report_lines) + "\n", encoding="utf-8")
    run_metadata = metadata(data, audit, config, horizon, configuration_hash(config_path))
    calibration_path = results / "priceiq_v1_calibration.json"
    if calibration_path.exists():
        run_metadata["calibration"] = json.loads(calibration_path.read_text(encoding="utf-8"))
    write_json(results / "run_metadata.json", run_metadata)
    return report


def main() -> None:
    parser = argparse.ArgumentParser(description="PriceIQ Research v1.0: calibrate on past history, evaluate only a later unseen period. Put --data before the command.")
    parser.add_argument("--data", default=str(DEFAULT_DATA), help="Genuine canonical longitudinal history; defaults to research/data/historical_prices.csv")
    parser.add_argument("--config", default=str(DEFAULT_CONFIG)); parser.add_argument("--results", default="research/results")
    commands = parser.add_subparsers(dest="command", required=True)
    calibrate_parser = commands.add_parser("calibrate", help="select and freeze thresholds using only data at/before --calibration-end")
    calibrate_parser.add_argument("--calibration-end", required=True, help="Inclusive calibration end date, YYYY-MM-DD")
    commands.add_parser("evaluate", help="evaluate frozen thresholds strictly after the saved calibration end")
    args = parser.parse_args()
    if not Path(args.data).exists(): parser.error(f"Historical input not found: {args.data}. Add a genuine CSV; no history will be fabricated.")
    if args.command == "calibrate": report = freeze(args.data, args.calibration_end, args.config, args.results)
    else: report = evaluate_unseen(args.data, args.config, args.results)
    print(f"{report['status'] if 'status' in report else 'FROZEN'}: {report}")


if __name__ == "__main__": main()
