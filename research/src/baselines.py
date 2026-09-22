"""Explicit non-production baselines. These rules are research comparators, not PriceIQ."""
from __future__ import annotations
from .feature_engine import Features


def decision(strategy: str, features: Features) -> str:
    if strategy == "BUY_NOW": return "BUY"
    if strategy == "30_DAY_AVERAGE":
        return "BUY" if features.reference_price is not None and features.current_price <= features.reference_price else "WAIT"
    if strategy == "EMA_ONLY":
        return "UNAVAILABLE" if features.ema is None else ("BUY" if features.current_price <= features.ema else "WAIT")
    if strategy == "14_OBSERVATION_SLOPE_ONLY":
        return "UNAVAILABLE" if features.slope is None else ("WAIT" if features.slope < 0 else "BUY")
    if strategy == "FULL_PRICEIQ": return "UNAVAILABLE"
    raise ValueError(f"unknown strategy {strategy}")


STRATEGIES = ("BUY_NOW", "30_DAY_AVERAGE", "EMA_ONLY", "14_OBSERVATION_SLOPE_ONLY", "FULL_PRICEIQ")
