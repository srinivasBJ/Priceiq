from __future__ import annotations
import hashlib, json, platform, subprocess
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

def metadata(path: str | Path, audit: dict[str, Any], rules: dict[str, Any], horizon: int, configuration_hash: str | None = None) -> dict[str, Any]:
    try: commit = subprocess.run(["git", "rev-parse", "HEAD"], capture_output=True, text=True, check=True).stdout.strip()
    except Exception: commit = None
    return {"dataset_filename": Path(path).name, "dataset_hash": audit["sha256"], "row_count": audit["row_count"],
        "product_count": audit["unique_products"], "date_range": [audit["earliest_date"], audit["latest_date"]], "code_version_commit": commit,
        "decision_rule_version": rules.get("decision_rule_version") or rules.get("methodology_version"), "configuration_hash": configuration_hash, "evaluation_horizon_days": horizon,
        "execution_timestamp": datetime.now(timezone.utc).isoformat(), "python_version": platform.python_version(),
        "dependency_versions": {"research": "0.1.0", "external_runtime_dependencies": "none (Python standard library)"}}

def write_json(path: str | Path, data: Any) -> None:
    Path(path).write_text(json.dumps(data, indent=2, sort_keys=True, default=str) + "\n")
