from __future__ import annotations
import argparse, csv
from pathlib import Path
from research.src.evaluator import evaluate

def main() -> None:
    p = argparse.ArgumentParser(); p.add_argument("--data", required=True); p.add_argument("--mode", default="HISTORICAL_PRICE_EVALUATION"); p.add_argument("--horizon", type=int, default=7); p.add_argument("--results", default="research/results"); p.add_argument("--config", default="research/config/decision_rules.yaml"); args = p.parse_args()
    report = evaluate(args.data, mode=args.mode, horizon=args.horizon, config=args.config, results=args.results, allow_invalid_rows=args.mode == "SMOKE_TEST")
    rows = [{"ablation": name, "status": "UNAVAILABLE", "reason": "Production PriceIQ signal thresholds/precedence are not recoverable."} for name in ("EMA only", "EMA + historical-low proximity", "EMA + slope", "EMA + slope + historical-low proximity", "Full PriceIQ")]
    output = Path(args.results) / "ablation.csv"; output.parent.mkdir(parents=True, exist_ok=True)
    with output.open("w", newline="", encoding="utf-8") as f: writer = csv.DictWriter(f, fieldnames=rows[0].keys()); writer.writeheader(); writer.writerows(rows)
    print(f"{report['status']}: wrote {output}")
if __name__ == "__main__": main()
