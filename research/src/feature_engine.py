"""Causal feature construction: every function accepts only the history through t."""
from __future__ import annotations

from dataclasses import dataclass
from datetime import timedelta
from statistics import fmean
from typing import Sequence

from .data_loader import Observation


@dataclass(frozen=True)
class Features:
    current_price: float
    reference_price: float | None
    ema: float | None
    ema_deviation: float | None
    slope: float | None
    historical_low: float | None
    historical_low_proximity: float | None
    target_condition: bool | None


def reference_price(history: Sequence[Observation], window_days: int = 30) -> float | None:
    if not history:
        return None
    end = history[-1].timestamp
    values = [item.price for item in history if item.timestamp >= end - timedelta(days=window_days)]
    return fmean(values) if values else None


def ema(history: Sequence[Observation], alpha: float | None) -> float | None:
    if not history or alpha is None:
        return None
    if not 0 < alpha <= 1:
        raise ValueError("EMA alpha must be in (0, 1]")
    value = history[0].price
    for item in history[1:]:
        value = alpha * item.price + (1 - alpha) * value
    return value


def ols_slope(history: Sequence[Observation], window: int = 14) -> float | None:
    items = list(history[-window:])
    if len(items) < window:
        return None
    xs = list(range(len(items)))  # observation index: no false daily spacing is assumed
    xbar = fmean(xs); ybar = fmean([item.price for item in items])
    denominator = sum((x - xbar) ** 2 for x in xs)
    return sum((x - xbar) * (item.price - ybar) for x, item in zip(xs, items)) / denominator


def build_features(history: Sequence[Observation], *, reference_window_days: int = 30, ema_alpha: float | None = None,
                   regression_window: int = 14, target_price: float | None = None) -> Features:
    if not history:
        raise ValueError("history is required")
    current = history[-1].price
    ref = reference_price(history, reference_window_days)
    ema_value = ema(history, ema_alpha)
    low = min(item.price for item in history)
    return Features(current, ref, ema_value, (current - ema_value) / ema_value if ema_value else None,
        ols_slope(history, regression_window), low, (current - low) / low if low else None,
        current <= target_price if target_price is not None else None)
