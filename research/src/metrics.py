"""Ex-post metrics. They are not forecasts or claimed realised customer savings."""
from __future__ import annotations
from collections import Counter
from statistics import mean, median
from typing import Any


def annotate_outcome(current: float, future_prices: list[float]) -> dict[str, float | None]:
    if not future_prices: return {"future_min_7d": None, "future_max_7d": None, "potential_saving": None, "regret": None}
    future_min, future_max = min(future_prices), max(future_prices)
    return {"future_min_7d": future_min, "future_max_7d": future_max,
        "potential_saving": max(0.0, current - future_min), "regret": max(0.0, future_max - current)}


def summarise(rows: list[dict[str, Any]], strategies: tuple[str, ...] = ()) -> list[dict[str, Any]]:
    grouped: dict[str, list[dict[str, Any]]] = {}
    for row in rows: grouped.setdefault(row["strategy"], []).append(row)
    output = []
    for strategy in strategies:
        grouped.setdefault(strategy, [])
    for strategy, group in grouped.items():
        values = lambda field: [r[field] for r in group if r.get(field) is not None]
        savings, regrets = values("potential_saving"), values("regret")
        output.append({"strategy": strategy, "n_decisions": len(group), "mean_potential_saving": mean(savings) if savings else None,
            "median_potential_saving": median(savings) if savings else None, "mean_regret": mean(regrets) if regrets else None,
            "median_regret": median(regrets) if regrets else None, "decision_counts": dict(Counter(r["decision"] for r in group)),
            "opportunity_capture_if_defined": None})
    return output
