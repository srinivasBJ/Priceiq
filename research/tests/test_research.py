from __future__ import annotations
import csv, tempfile, unittest
from datetime import datetime, timedelta
from pathlib import Path

from research.src.baselines import decision
from research.src.data_loader import DataValidationError, Observation, audit_csv, canonicalize_historical
from research.src.decision_engine import deterministic_priceiq_decision, load_rules
from research.src.feature_engine import build_features, ema, ols_slope, reference_price
from research.src.leakage_checks import assert_causal_features
from research.src.metrics import annotate_outcome, summarise
from research.priceiq_engine.calibration import calibrate, calibration_cases
from research.priceiq_engine.config import is_frozen, load as load_v1, write as write_v1
from research.priceiq_engine.decision import decide as decide_v1

def obs(prices: list[float], start: datetime = datetime(2026, 1, 1)) -> list[Observation]:
    return [Observation("p", "Product", "Test", "Amazon.in", start + timedelta(days=i), price, "INR", "test") for i, price in enumerate(prices)]

class ResearchTests(unittest.TestCase):
    def test_ema_reference_slope_and_low(self) -> None:
        history = obs([10, 20, 30])
        self.assertEqual(ema(history, .5), 22.5)
        self.assertEqual(reference_price(history, 30), 20)
        self.assertIsNone(ols_slope(history, 14))
        self.assertEqual(ols_slope(history, 3), 10)
        features = build_features(history, ema_alpha=.5, regression_window=3)
        self.assertEqual(features.historical_low, 10)
        self.assertEqual(features.historical_low_proximity, 2)

    def test_missing_history_and_irregular_dates(self) -> None:
        self.assertIsNone(ema([], .5)); self.assertIsNone(reference_price([], 30))
        history = obs([10, 20, 30]); history[2] = Observation(*history[2].__dict__.values())
        self.assertEqual(ols_slope(history, 3), 10)

    def test_decision_is_unavailable_without_recovered_rules(self) -> None:
        rules = load_rules("research/config/decision_rules.yaml")
        features = build_features(obs([10] * 14), regression_window=14)
        decision_name, reasons = deterministic_priceiq_decision(features, rules)
        self.assertEqual(decision_name, "UNAVAILABLE")
        self.assertTrue(reasons)

    def test_baselines_and_metrics(self) -> None:
        features = build_features(obs([10] * 14), regression_window=14)
        self.assertEqual(decision("BUY_NOW", features), "BUY")
        self.assertEqual(decision("30_DAY_AVERAGE", features), "BUY")
        outcome = annotate_outcome(100, [90, 110])
        self.assertEqual(outcome["potential_saving"], 10)
        result = summarise([{"strategy": "BUY_NOW", "decision": "BUY", "potential_saving": 10, "regret": 10}], ("BUY_NOW", "FULL_PRICEIQ"))
        self.assertEqual(result[0]["n_decisions"], 1); self.assertEqual(result[1]["n_decisions"], 0)

    def test_leakage_partition_and_reproducibility(self) -> None:
        history, future = obs([10] * 14), obs([9], datetime(2026, 2, 1))
        assert_causal_features(history, future, ema_alpha=.2, regression_window=14)
        with self.assertRaises(AssertionError): assert_causal_features(history, [history[-1]], ema_alpha=.2, regression_window=14)

    def test_validation_duplicate_zero_and_schema(self) -> None:
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "test.csv"
            fields = ["product_id", "product_name", "category", "marketplace", "timestamp", "price", "currency", "source"]
            rows = [{"product_id":"p", "product_name":"P", "category":"C", "marketplace":"A", "timestamp":"2026-01-01", "price":"10", "currency":"INR", "source":"x"},
                    {"product_id":"p", "product_name":"P", "category":"C", "marketplace":"A", "timestamp":"2026-01-01", "price":"10", "currency":"INR", "source":"x"}]
            with path.open("w", newline="") as f: writer=csv.DictWriter(f, fieldnames=fields); writer.writeheader(); writer.writerows(rows)
            report = audit_csv(path); self.assertEqual(report["duplicate_rows"], 1)
            with self.assertRaises(DataValidationError): canonicalize_historical(path)
            rows[1]["timestamp"] = "2026-01-02"; rows[1]["price"] = "0"
            with path.open("w", newline="") as f: writer=csv.DictWriter(f, fieldnames=fields); writer.writeheader(); writer.writerows(rows)
            with self.assertRaises(DataValidationError): canonicalize_historical(path)

    def test_priceiq_research_v1_calibrates_before_deciding(self) -> None:
        prices = [100 + ((index * 7) % 17) - 8 for index in range(60)]
        history = obs(prices)
        template = load_v1("research/config/priceiq_v1.yaml")
        cases = calibration_cases(history, datetime(2026, 2, 10), template)
        frozen, report = calibrate(cases, template)
        frozen["calibration_end"] = "2026-02-10"; frozen["calibration_dataset_hash"] = "test-hash"
        self.assertTrue(is_frozen(frozen)); self.assertGreaterEqual(report["n_calibration_cases"], 20)
        features = build_features(history[:20], ema_alpha=.15, regression_window=14)
        self.assertIn(decide_v1(features, frozen).label, ("BUY", "WATCH", "WAIT", "AVOID"))
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "priceiq_v1.yaml"; write_v1(path, frozen)
            self.assertTrue(is_frozen(load_v1(path)))

    def test_v1_calibration_uses_empirical_candidates_and_can_disable(self) -> None:
        prices = [100] * 45
        history = obs(prices)
        template = load_v1("research/config/priceiq_v1.yaml")
        cases = calibration_cases(history, datetime(2026, 2, 10), template)
        frozen, report = calibrate(cases, template)
        self.assertEqual(report["candidate_counts"]["ema"]["active_candidate_pairs"], 0)
        self.assertIn("ema", report["disabled_features"])
        self.assertIsNone(frozen["ema_favourable_threshold"])
        self.assertFalse(frozen["ema_feature_enabled"])

if __name__ == "__main__": unittest.main()
