"""Explanation export. It deliberately does not invoke a model or accept secret keys."""
from __future__ import annotations
import re
from dataclasses import asdict
from typing import Any
from .decision_engine import numerical_template
from .feature_engine import Features

def consistency_check(text: str, features: Features) -> list[str]:
    allowed = {str(round(float(value), 4)) for value in asdict(features).values() if isinstance(value, (float, int))}
    unsupported = []
    for token in re.findall(r"\b\d+(?:\.\d+)?\b", text):
        if token not in allowed and token not in {"7", "14", "30"}: unsupported.append(token)
    return unsupported

def export_case(case_id: str, decision: str, features: Features) -> dict[str, Any]:
    template = numerical_template(decision, features)
    return {"case_id": case_id, "deterministic_decision": decision, "feature_values": asdict(features),
        "numeric_template_explanation": template, "llm_explanation": None, "consistency_check": "NOT_RUN_NO_LLM_OUTPUT"}
