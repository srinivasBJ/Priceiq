"""Dataset classification and conservative column mapping."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


CANONICAL_REQUIRED = ("product_id", "product_name", "category", "marketplace", "timestamp", "price", "currency", "source")


@dataclass(frozen=True)
class SchemaAssessment:
    classification: str
    timestamp_column: str | None
    price_column: str | None
    product_id_column: str | None
    category_column: str | None
    reason: str


def find_column(columns: Iterable[str], candidates: Iterable[str]) -> str | None:
    lookup = {column.lower().strip(): column for column in columns}
    for candidate in candidates:
        if candidate in lookup:
            return lookup[candidate]
    return None


def assess_schema(columns: Iterable[str], repeated_product_ids: int = 0, unique_dates: int = 0) -> SchemaAssessment:
    columns = list(columns)
    timestamp = find_column(columns, ("timestamp", "scraped_at", "date", "created_at"))
    price = find_column(columns, ("price", "price_inr", "product_price", "Price".lower()))
    product_id = find_column(columns, ("product_id", "asin", "ASIN".lower(), "sku"))
    category = find_column(columns, ("category",))
    lower = {c.lower() for c in columns}
    if {"product_id", "timestamp", "price"}.issubset(lower) and repeated_product_ids and unique_dates >= 21:
        return SchemaAssessment("PRIMARY_HISTORICAL_PRICE_DATA", timestamp, price, product_id, category,
            "Canonical repeated timestamped prices span sufficient distinct dates; density validation still applies.")
    if {"product_id", "timestamp", "price"}.issubset(lower):
        return SchemaAssessment("SPARSE_PUBLIC_PRICE_HISTORY", timestamp, price, product_id, category,
            "Canonical price observations are present, but density must be evaluated separately.")
    if timestamp and price and product_id and unique_dates <= 1:
        return SchemaAssessment("PRODUCT_CATALOG_SNAPSHOT", timestamp, price, product_id, category,
            "A timestamp is present, but all rows describe one snapshot date rather than a longitudinal series.")
    if timestamp and price and product_id and repeated_product_ids and unique_dates > 1:
        return SchemaAssessment("PRIMARY_HISTORICAL_PRICE_DATA", timestamp, price, product_id, category,
            "Repeated timestamped prices exist; suitability still requires density validation.")
    if timestamp and price and product_id:
        return SchemaAssessment("TRANSACTION_DATA", timestamp, price, product_id, category,
            "Timestamped rows lack repeated longitudinal observations per product.")
    if price and product_id:
        return SchemaAssessment("PRODUCT_CATALOG_SNAPSHOT", timestamp, price, product_id, category,
            "Product prices are present without longitudinal timestamps per product.")
    return SchemaAssessment("UNSUITABLE", timestamp, price, product_id, category,
        "Required product identity, price, and longitudinal timestamp fields are not available.")
