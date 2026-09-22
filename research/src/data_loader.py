"""Strict CSV audit and canonical historical-price adapter; standard library only."""
from __future__ import annotations

import csv
import hashlib
from collections import Counter, defaultdict
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any

from .schema_detection import SchemaAssessment, assess_schema, find_column


DATE_FORMATS = ("%Y-%m-%d", "%d-%m-%Y", "%m/%d/%y", "%m/%d/%Y", "%Y-%m-%d %H:%M:%S", "%Y-%m-%dT%H:%M:%S")


@dataclass(frozen=True)
class Observation:
    product_id: str
    product_name: str
    category: str
    marketplace: str
    timestamp: datetime
    price: float
    currency: str
    source: str
    seller: str = ""
    availability: str = ""
    rating: str = ""
    shipping: str = ""


class DataValidationError(ValueError):
    pass


def parse_timestamp(value: str) -> datetime:
    value = (value or "").strip()
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(value, fmt)
        except ValueError:
            pass
    raise DataValidationError(f"invalid timestamp: {value!r}")


def parse_price(value: str) -> float:
    value = (value or "").strip().replace(",", "").replace("₹", "").replace("INR", "")
    try:
        parsed = float(value)
    except ValueError as error:
        raise DataValidationError(f"non-numeric price: {value!r}") from error
    if parsed <= 0:
        raise DataValidationError(f"price must be positive: {parsed}")
    return parsed


def read_csv(path: str | Path) -> tuple[list[str], list[dict[str, str]]]:
    with Path(path).open(encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        return list(reader.fieldnames or []), list(reader)


def _date_values(rows: list[dict[str, str]], column: str | None) -> list[datetime]:
    if not column:
        return []
    values = []
    for row in rows:
        if row.get(column, "").strip():
            try:
                values.append(parse_timestamp(row[column]))
            except DataValidationError:
                continue
    return values


def audit_csv(path: str | Path) -> dict[str, Any]:
    path = Path(path)
    columns, rows = read_csv(path)
    id_column = find_column(columns, ("product_id", "asin", "ASIN".lower(), "sku"))
    date_column = find_column(columns, ("timestamp", "scraped_at", "date", "created_at"))
    price_column = find_column(columns, ("price", "price_inr", "product_price"))
    category_column = find_column(columns, ("category",))
    marketplace_column = find_column(columns, ("marketplace",))
    source_column = find_column(columns, ("source", "source_url", "product_url", "Product_URL".lower()))
    ids = [r.get(id_column, "").strip() for r in rows if id_column and r.get(id_column, "").strip()]
    id_counts = Counter(ids)
    dates = _date_values(rows, date_column)
    row_tuples = [tuple(row.get(c, "") for c in columns) for row in rows]
    assessment = assess_schema(columns, sum(c > 1 for c in id_counts.values()), len(set(dates)))
    # An exact canonical file can be sparse; never upgrade it based only on a date column.
    observations_per_product = {
        "min": min(id_counts.values()) if id_counts else 0,
        "max": max(id_counts.values()) if id_counts else 0,
        "mean": round(sum(id_counts.values()) / len(id_counts), 3) if id_counts else 0,
        "distribution": dict(sorted(Counter(id_counts.values()).items())),
    }
    missing = {c: sum(not str(r.get(c, "")).strip() for r in rows) for c in columns}
    synthetic = []
    if "observation_type" in columns:
        synthetic.append("observation_type is an event label, not evidence of regular daily tracking")
    if not date_column:
        synthetic.append("no observation timestamp; rows are snapshot-like")
    if date_column and len(set(dates)) == 1:
        synthetic.append("all dated rows share one date; this is a point-in-time snapshot")
    return {
        "filename": path.name,
        "path": str(path.resolve()),
        "sha256": hashlib.sha256(path.read_bytes()).hexdigest(),
        "row_count": len(rows), "columns": columns,
        "date_columns": [date_column] if date_column else [], "price_columns": [price_column] if price_column else [],
        "product_identifier_columns": [id_column] if id_column else [], "category_columns": [category_column] if category_column else [],
        "marketplace_source_columns": [c for c in (marketplace_column, source_column) if c],
        "earliest_date": min(dates).isoformat() if dates else None, "latest_date": max(dates).isoformat() if dates else None,
        "unique_products": len(id_counts), "unique_dates": len(set(dates)), "observations_per_product": observations_per_product,
        "repeated_same_product": any(c > 1 for c in id_counts.values()), "missing_values": missing,
        "duplicate_rows": len(rows) - len(set(row_tuples)), "apparent_synthetic_or_generated_fields": synthetic,
        "provenance": {"source_column": source_column, "sample_source": next((r.get(source_column, "") for r in rows if source_column and r.get(source_column)), None)},
        "classification": assessment.classification, "classification_reason": assessment.reason,
        "suitable_for_primary": assessment.classification == "PRIMARY_HISTORICAL_PRICE_DATA" and observations_per_product["min"] >= 21,
    }


def canonicalize_historical(path: str | Path) -> tuple[list[Observation], dict[str, Any]]:
    """Accept only an explicitly canonical historical CSV; never fabricate dates or prices."""
    report = audit_csv(path)
    columns, rows = read_csv(path)
    required = {"product_id", "product_name", "category", "marketplace", "timestamp", "price", "currency"}
    absent = required.difference(columns)
    if absent:
        raise DataValidationError(f"historical adapter requires canonical fields; missing: {', '.join(sorted(absent))}")
    observations: list[Observation] = []
    violations = []
    for number, row in enumerate(rows, start=2):
        if not row.get("product_id", "").strip() or not row.get("product_name", "").strip():
            violations.append(f"row {number}: missing product identity")
            continue
        try:
            observations.append(Observation(
                product_id=row["product_id"].strip(), product_name=row["product_name"].strip(), category=row["category"].strip(),
                marketplace=row["marketplace"].strip(), timestamp=parse_timestamp(row["timestamp"]), price=parse_price(row["price"]),
                currency=row["currency"].strip(), source=(row.get("source") or row.get("source_url") or "").strip(),
                seller=row.get("seller", "").strip(), availability=row.get("availability", "").strip(),
                rating=row.get("rating", "").strip(), shipping=row.get("shipping", "").strip()))
        except DataValidationError as error:
            violations.append(f"row {number}: {error}")
    if violations:
        raise DataValidationError("; ".join(violations[:10]))
    # Same product/timestamp is ambiguous even when the stated price differs; never aggregate silently.
    key_counts = Counter((o.product_id, o.timestamp) for o in observations)
    duplicate_keys = [key for key, count in key_counts.items() if count > 1]
    if duplicate_keys:
        raise DataValidationError(f"duplicate canonical observations found ({len(duplicate_keys)}); resolve explicitly before evaluation")
    currencies = {o.currency for o in observations}
    if len(currencies) != 1:
        raise DataValidationError(f"currency inconsistency: {sorted(currencies)}")
    observations.sort(key=lambda x: (x.product_id, x.timestamp))
    return observations, report


def grouped(observations: list[Observation]) -> dict[str, list[Observation]]:
    result: dict[str, list[Observation]] = defaultdict(list)
    for observation in observations:
        result[observation.product_id].append(observation)
    return dict(result)
