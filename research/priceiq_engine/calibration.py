"""Chronological, interpretable threshold selection for PriceIQ Research v1.0."""
from __future__ import annotations

from datetime import datetime, timedelta
from itertools import product
from typing import Any

from research.src.data_loader import Observation, grouped
from research.src.feature_engine import Features, build_features
from .decision import decide


def _future(series: list[Observation], index: int, horizon: int) -> list[Observation]:
    end = series[index].timestamp + timedelta(days=horizon)
    return [item for item in series[index + 1:] if item.timestamp <= end]


def calibration_cases(observations: list[Observation], cutoff: datetime, config: dict[str, Any]) -> list[dict[str, Any]]:
    """Only points whose *complete* outcome horizon is within the calibration period."""
    cases = []
    for product_id, series in grouped(observations).items():
        for index in range(int(config["regression_window"]) - 1, len(series)):
            current = series[index]
            future = _future(series, index, int(config["evaluation_horizon_days"]))
            if current.timestamp > cutoff or not future or future[-1].timestamp > cutoff:
                continue
            features = build_features(series[:index + 1], reference_window_days=int(config["reference_window_days"]), ema_alpha=float(config["ema_alpha"]), regression_window=int(config["regression_window"]))
            if None in (features.ema_deviation, features.slope, features.historical_low_proximity):
                continue
            # Oracle is only a calibration target: BUY means no lower observed price in the next horizon.
            oracle = "BUY" if min(item.price for item in future) >= features.current_price else "WAIT"
            cases.append({"product_id": product_id, "timestamp": current.timestamp.isoformat(), "features": features, "oracle": oracle})
    return cases


def _empirical_cutpoints(values: list[float]) -> list[float]:
    """Return observed support cut points without fabricating a numeric value.

    Quantiles are taken over the deduplicated empirical support, rather than
    over frequency-weighted rows.  This prevents a repeated unchanged price
    from collapsing every candidate to the mode while retaining only values
    actually observed in the calibration partition.
    """
    support = sorted(set(values))
    if len(support) < 2:
        return []
    positions = {round(index * (len(support) - 1) / 4) for index in range(5)}
    return [support[index] for index in sorted(positions)]


def _paired_options(values: list[float]) -> tuple[list[tuple[bool, float | None, float | None]], dict[str, Any]]:
    cutpoints = _empirical_cutpoints(values)
    active = [(True, lower, upper) for lower_index, lower in enumerate(cutpoints)
              for upper in cutpoints[lower_index + 1:]]
    options = active + [(False, None, None)]
    return options, {
        "observed_unique_values": len(set(values)),
        "empirical_cut_points": len(cutpoints),
        "active_candidate_pairs": len(active),
        "disabled_candidate": 1,
        "non_discriminating": not active,
    }


def _single_options(values: list[float]) -> tuple[list[tuple[bool, float | None]], dict[str, Any]]:
    cutpoints = _empirical_cutpoints(values)
    active = [(True, value) for value in cutpoints]
    options = active + [(False, None)]
    return options, {
        "observed_unique_values": len(set(values)),
        "empirical_cut_points": len(cutpoints),
        "active_candidate_thresholds": len(active),
        "disabled_candidate": 1,
        "non_discriminating": not active,
    }


def _score(label: str, oracle: str) -> tuple[float, float]:
    # BUY maps to BUY; WAIT/AVOID map to defer; WATCH is deliberately neutral.
    if label == "WATCH": return .5, 0.0
    predicted = "BUY" if label == "BUY" else "WAIT"
    return (1.0 if predicted == oracle else 0.0), 1.0


def calibrate(cases: list[dict[str, Any]], template: dict[str, Any]) -> tuple[dict[str, Any], dict[str, Any]]:
    if len(cases) < 20:
        raise ValueError(f"Calibration requires at least 20 complete calibration decision points; found {len(cases)}.")
    feature_values = {key: [float(getattr(case["features"], key)) for case in cases] for key in ("ema_deviation", "slope", "historical_low_proximity")}
    ema_options, ema_counts = _paired_options(feature_values["ema_deviation"])
    slope_options, slope_counts = _paired_options(feature_values["slope"])
    low_options, low_counts = _single_options(feature_values["historical_low_proximity"])
    candidates = []
    for ema, slope, low in product(ema_options, slope_options, low_options):
        ema_enabled, ema_fav, ema_high = ema
        slope_enabled, slope_down, slope_up = slope
        low_enabled, low_threshold = low
        config = {**template,
            "ema_feature_enabled": ema_enabled, "ema_favourable_threshold": ema_fav, "ema_elevated_threshold": ema_high,
            "slope_feature_enabled": slope_enabled, "slope_downward_threshold": slope_down, "slope_upward_threshold": slope_up,
            "historical_low_feature_enabled": low_enabled, "historical_low_proximity_threshold": low_threshold,
        }
        scored = [_score(decide(case["features"], config).label, case["oracle"]) for case in cases]
        score = sum(pair[0] for pair in scored) / len(scored)
        coverage = sum(pair[1] for pair in scored) / len(scored)
        candidates.append((score, coverage, config))
    if not candidates: raise ValueError("No valid calibration threshold combinations were generated.")
    threshold_keys = ("ema_favourable_threshold", "ema_elevated_threshold", "slope_downward_threshold", "slope_upward_threshold", "historical_low_proximity_threshold")
    # Stable ties retain the prior score/coverage/lexical ordering. Disabled
    # features sort after every numeric, empirical threshold in an exact tie.
    def tie_values(config: dict[str, Any]) -> tuple[float, ...]:
        return tuple(-(float(config[key]) if config[key] is not None else float("inf")) for key in threshold_keys)
    score, coverage, selected = max(candidates, key=lambda item: (item[0], item[1], tie_values(item[2])))
    disabled = [name for name, key in (("ema", "ema_feature_enabled"), ("slope", "slope_feature_enabled"), ("historical_low_proximity", "historical_low_feature_enabled")) if not selected[key]]
    config = {**selected, "configuration_status": "FROZEN", "calibration_n_decision_points": len(cases),
        "calibration_candidate_count": len(candidates), "calibration_objective": "mean neutral-WATCH binary action score; BUY if no lower observed price within horizon, otherwise WAIT; AVOID maps to WAIT", "calibration_score": round(score, 8)}
    report = {"n_calibration_cases": len(cases), "candidate_count": len(candidates),
        "candidate_counts": {"ema": ema_counts, "slope": slope_counts, "historical_low_proximity": low_counts},
        "objective": config["calibration_objective"], "selected_score": score, "actionable_coverage": coverage,
        "selected_thresholds": {key: config[key] for key in threshold_keys}, "disabled_features": disabled}
    return config, report
