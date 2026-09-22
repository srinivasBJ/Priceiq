# Research data

Place a genuine longitudinal source at `research/data/historical_prices.csv` when it becomes available. It must contain exactly these required canonical fields: `product_id`, `product_name`, `category`, `marketplace`, `timestamp`, `price`, and `currency` (a source URL/label is strongly recommended). Do not create this file from catalog snapshots, transactions, interpolation, or fabricated values.

The supplied starter CSV is smoke-test-only; it must never be presented as dense daily tracking. The CLI records the file hash, so an external data file may also be passed explicitly.
