"""Production-decision guardrail. Unknown production rules never become invented decisions."""
from __future__ import annotations

from dataclasses import asdict
from pathlib import Path
from typing import Any

from .feature_engine import Features


def load_rules(path: str | Path) -> dict[str, Any]:
    """Small parser for the deliberately flat committed YAML configuration."""
    rules: dict[str, Any] = {}
    for raw in Path(path).read_text().splitlines():
        raw = raw.strip()
        if not raw or raw.startswith("#") or ":" not in raw:
            continue
        key, value = (part.strip() for part in raw.split(":", 1))
        if value == "null": rules[key] = None
        elif value.startswith('"') and value.endswith('"'): rules[key] = value[1:-1]
        else:
            try: rules[key] = float(value) if "." in value else int(value)
            except ValueError: rules[key] = value
    return rules


REQUIRED_DECISION_RULES = ("ema_alpha", "ema_favourable_threshold", "ema_elevated_threshold", "slope_downward_threshold", "slope_upward_threshold", "historical_low_threshold")


def recovered(rules: dict[str, Any]) -> bool:
    return all(rules.get(key) is not None for key in REQUIRED_DECISION_RULES)


def deterministic_priceiq_decision(features: Features, rules: dict[str, Any]) -> tuple[str, list[str]]:
    if not recovered(rules):
        return "UNAVAILABLE", ["Production decision thresholds are not recoverable from the supplied PriceIQ repository."]
    # Only reachable if a future, documented recovery fills every threshold.
    categories = []
    categories.append("EMA_FAVOURABLE" if features.ema_deviation is not None and features.ema_deviation <= rules["ema_favourable_threshold"] else "EMA_ELEVATED")
    categories.append("SLOPE_DOWN" if features.slope is not None and features.slope <= rules["slope_downward_threshold"] else "SLOPE_UP")
    categories.append("NEAR_HISTORICAL_LOW" if features.historical_low_proximity is not None and features.historical_low_proximity <= rules["historical_low_threshold"] else "ABOVE_HISTORICAL_LOW")
    # The repository did not expose precedence. A complete recovered config must add it before use.
    return "UNAVAILABLE", categories + ["Decision precedence is not documented in supplied production code."]


def numerical_template(decision: str, features: Features) -> str:
    values = {key: value for key, value in asdict(features).items() if value is not None}
    return f"Deterministic decision: {decision}. Supplied values: " + ", ".join(f"{key}={value:.4f}" if isinstance(value, float) else f"{key}={value}" for key, value in values.items()) + "."
