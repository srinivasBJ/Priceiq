"""Conservative paired comparison export; no test is reported when there is no valid pair set."""
from __future__ import annotations
import csv, random
from pathlib import Path
from statistics import mean
from typing import Any

def paired_bootstrap(rows: list[dict[str, Any]], a: str, b: str, seed: int = 20260922) -> dict[str, Any]:
    by_key: dict[tuple[str, str], dict[str, dict[str, Any]]] = {}
    for row in rows: by_key.setdefault((row["product_id"], row["timestamp"]), {})[row["strategy"]] = row
    diffs = [float(pair[a]["regret"]) - float(pair[b]["regret"]) for pair in by_key.values()
             if a in pair and b in pair and pair[a].get("regret") is not None and pair[b].get("regret") is not None]
    base = {"strategy_a": a, "strategy_b": b, "unit_of_analysis": "product decision point", "null_hypothesis": "mean paired regret difference is zero", "alternative_hypothesis": "two-sided", "confidence_level": 0.95, "multiple_comparison_handling": "not performed; exploratory", "n_pairs": len(diffs)}
    if len(diffs) < 10:
        return {**base, "status": "NOT_PERFORMED", "reason": "fewer than 10 paired non-null decision points", "mean_difference": None, "ci_lower": None, "ci_upper": None, "wilcoxon": "not performed"}
    rng = random.Random(seed); samples = sorted(mean([rng.choice(diffs) for _ in diffs]) for _ in range(2000))
    return {**base, "status": "EXPLORATORY_BOOTSTRAP", "reason": "bootstrap CI only; Wilcoxon unavailable without a validated external statistics dependency", "mean_difference": mean(diffs), "ci_lower": samples[49], "ci_upper": samples[1949], "wilcoxon": "not performed"}

def write_summary(rows: list[dict[str, Any]], output: str | Path) -> list[dict[str, Any]]:
    result = [paired_bootstrap(rows, "FULL_PRICEIQ", baseline) for baseline in ("BUY_NOW", "30_DAY_AVERAGE", "EMA_ONLY", "14_OBSERVATION_SLOPE_ONLY")]
    with Path(output).open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=result[0].keys()); writer.writeheader(); writer.writerows(result)
    return result
