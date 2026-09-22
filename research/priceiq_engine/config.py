"""Read/write the deliberately flat, versioned Research v1 configuration."""
from __future__ import annotations

import hashlib
from pathlib import Path
from typing import Any


def load(path: str | Path) -> dict[str, Any]:
    values: dict[str, Any] = {}
    for raw in Path(path).read_text(encoding="utf-8").splitlines():
        raw = raw.strip()
        if not raw or raw.startswith("#") or ":" not in raw:
            continue
        key, value = (piece.strip() for piece in raw.split(":", 1))
        if value == "null": values[key] = None
        elif value in ("true", "false"): values[key] = value == "true"
        elif value.startswith('"') and value.endswith('"'): values[key] = value[1:-1]
        else:
            try: values[key] = float(value) if "." in value else int(value)
            except ValueError: values[key] = value
    return values


def configuration_hash(path: str | Path) -> str:
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def is_frozen(config: dict[str, Any]) -> bool:
    required = ("calibration_end", "calibration_dataset_hash")
    feature_thresholds = (("ema_feature_enabled", ("ema_favourable_threshold", "ema_elevated_threshold")),
        ("slope_feature_enabled", ("slope_downward_threshold", "slope_upward_threshold")),
        ("historical_low_feature_enabled", ("historical_low_proximity_threshold",)))
    return config.get("configuration_status") == "FROZEN" and all(config.get(key) is not None for key in required) and all(
        not config.get(enabled_key, True) or all(config.get(key) is not None for key in thresholds)
        for enabled_key, thresholds in feature_thresholds)


def write(path: str | Path, config: dict[str, Any]) -> None:
    order = ("methodology_name", "methodology_version", "configuration_status", "ema_alpha", "reference_window_days", "regression_window", "evaluation_horizon_days", "ema_feature_enabled", "ema_favourable_threshold", "ema_elevated_threshold", "slope_feature_enabled", "slope_downward_threshold", "slope_upward_threshold", "historical_low_feature_enabled", "historical_low_proximity_threshold", "target_price_enabled", "calibration_end", "calibration_dataset_hash", "calibration_n_decision_points", "calibration_candidate_count", "calibration_objective", "calibration_score")
    lines = ["# PriceIQ Research v1.0 -- NEW calibrated methodology, not the lost production implementation."]
    for key in order:
        value = config.get(key)
        if value is None: rendered = "null"
        elif isinstance(value, bool): rendered = str(value).lower()
        elif isinstance(value, str): rendered = f'"{value}"'
        else: rendered = str(value)
        lines.append(f"{key}: {rendered}")
    Path(path).write_text("\n".join(lines) + "\n", encoding="utf-8")
