"""Deterministic, documented PriceIQ Research v1.0 decision rule."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from research.src.feature_engine import Features


@dataclass(frozen=True)
class Decision:
    label: str
    reasons: tuple[str, ...]


def decide(features: Features, config: dict[str, Any]) -> Decision:
    """Apply frozen v1 thresholds. This has no LLM or production-code dependency.

    Precedence: optional target BUY; expensive/rising AVOID; cheap/near-low BUY;
    falling/not-near-low WAIT; otherwise WATCH.
    """
    ema_enabled = config.get("ema_feature_enabled", True)
    slope_enabled = config.get("slope_feature_enabled", True)
    low_enabled = config.get("historical_low_feature_enabled", True)
    required = ((ema_enabled, ("ema_favourable_threshold", "ema_elevated_threshold")),
        (slope_enabled, ("slope_downward_threshold", "slope_upward_threshold")),
        (low_enabled, ("historical_low_proximity_threshold",)))
    if any(enabled and any(config.get(key) is None for key in keys) for enabled, keys in required):
        return Decision("UNAVAILABLE", ("PriceIQ Research v1.0 thresholds have not been calibrated and frozen.",))
    if config.get("target_price_enabled") and features.target_condition:
        return Decision("BUY", ("optional target price condition met",))
    required_features = ((ema_enabled, features.ema_deviation), (slope_enabled, features.slope), (low_enabled, features.historical_low_proximity))
    if any(enabled and value is None for enabled, value in required_features):
        return Decision("UNAVAILABLE", ("insufficient feature history",))
    # A disabled feature has no predicate in the fixed precedence. It is never
    # replaced with a hand-picked numerical fallback.
    near_low = not low_enabled or features.historical_low_proximity <= config["historical_low_proximity_threshold"]
    not_near_low = low_enabled and not near_low
    favourable = not ema_enabled or features.ema_deviation <= config["ema_favourable_threshold"]
    elevated = ema_enabled and features.ema_deviation >= config["ema_elevated_threshold"]
    downward = slope_enabled and features.slope <= config["slope_downward_threshold"]
    upward = slope_enabled and features.slope >= config["slope_upward_threshold"]
    not_strongly_falling = not slope_enabled or features.slope >= config["slope_downward_threshold"]
    if elevated and upward:
        return Decision("AVOID", ("price elevated versus EMA", "upward slope"))
    if favourable and near_low and not_strongly_falling:
        return Decision("BUY", ("price favourable versus EMA" if ema_enabled else "EMA feature disabled", "near historical low" if low_enabled else "historical-low feature disabled", "not strongly falling" if slope_enabled else "slope feature disabled"))
    if downward and not_near_low:
        return Decision("WAIT", ("downward slope", "not near historical low"))
    return Decision("WATCH", ("mixed deterministic signals",))
