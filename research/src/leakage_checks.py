"""Assertions that make accidental future-data feature construction visible."""
from __future__ import annotations
from .data_loader import Observation
from .feature_engine import build_features


def assert_causal_features(history: list[Observation], future: list[Observation], **kwargs: object) -> None:
    before = build_features(history, **kwargs)
    after = build_features(history, **kwargs)
    if before != after:
        raise AssertionError("feature construction is non-deterministic")
    if future and any(item.timestamp <= history[-1].timestamp for item in future):
        raise AssertionError("future partition includes observation at/before decision timestamp")
