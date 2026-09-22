# Production PriceIQ decision-logic audit

## Source of truth found

No deterministic PriceIQ purchase-timing engine is present in the supplied application. There is no implementation of a 30-day reference price, EMA/alpha, current-to-EMA comparison, 14-observation regression slope, historical-low proximity, target-price condition, qualitative signal categories, or BUY/WATCH/WAIT/AVOID precedence.

- `backend/prisma/schema.prisma` defines a `PriceHistory` persistence model only.
- `backend/src/modules/products/product.service.ts` creates a history record on product creation or manual price update; it performs no timing computation.
- `frontend/src/pages/PriceTrackerPage.tsx` function `makeHistory` creates a random 14-point display series from static catalog range values. This is explicitly synthetic UI display data, not a data source or decision implementation.
- The same page labels a display card “Good time to buy” only when `dropFromMrp > 5`; it is a cosmetic MRP-discount condition, does not yield the requested decision classes, and cannot be promoted to the requested PriceIQ methodology.
- `backend/src/modules/ai/ai.service.ts` is a general merchant-pricing chat/recommendation service. It does not supply a deterministic consumer timing decision and is not used by research decision generation.

## Reproducibility result

Threshold recovery is **unavailable**. `research/config/decision_rules.yaml` therefore preserves all unavailable decision thresholds as `null`, and `FULL_PRICEIQ` returns `UNAVAILABLE`. The 30-day reference and 14-observation regression settings in the research module are protocol/baseline definitions, not claims of production identity.

The production tracker’s display copy and the requested research methodology differ materially. A versioned historical production implementation or an authoritative rules specification is required before Full PriceIQ can be evaluated or any BUY/WATCH/WAIT/AVOID claim can be made.

## Reference-project availability

No checkout or files from the named `amazon_sales_analytics` reference project were present in the supplied PriceIQ workspace or the three supplied dataset paths at audit time. Consequently no external cleaning utility was copied or represented as used. The CSV adapter implements only conservative standard-library parsing and validation.
