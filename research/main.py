"""Command line entry point for the isolated research evaluator."""
from __future__ import annotations
import argparse
from pathlib import Path
from .src.evaluator import MODES, evaluate

ROOT = Path(__file__).resolve().parent

def parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="PriceIQ causal research evaluator (never changes production behavior).")
    p.add_argument("--data", required=True, help="CSV input path; only canonical historical CSV is accepted for an evaluation.")
    p.add_argument("--mode", choices=MODES, default="HISTORICAL_PRICE_EVALUATION")
    p.add_argument("--horizon", type=int, default=7, help="Future evaluation horizon in calendar days (default: 7).")
    p.add_argument("--config", default=str(ROOT / "config" / "decision_rules.yaml"))
    p.add_argument("--results", default=str(ROOT / "results"))
    return p

def main() -> None:
    args = parser().parse_args()
    report = evaluate(args.data, mode=args.mode, horizon=args.horizon, config=args.config, results=args.results,
                      allow_invalid_rows=args.mode == "SMOKE_TEST")
    print(f"{report['status']}: {report.get('valid_decision_points', 0)} valid decision points")

if __name__ == "__main__": main()
