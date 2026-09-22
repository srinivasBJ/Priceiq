from __future__ import annotations
import argparse, csv, json
from pathlib import Path
from research.src.llm_explanations import export_case
from research.src.feature_engine import Features

def main() -> None:
    p = argparse.ArgumentParser(); p.add_argument("--predictions", default="research/results/predictions.csv"); p.add_argument("--output", default="research/results/llm_explanation_cases.csv"); p.add_argument("--study-output", default="research/results/human_study_export.csv"); args = p.parse_args()
    with Path(args.predictions).open(encoding="utf-8") as f: rows = list(csv.DictReader(f))
    output = []
    for i, row in enumerate(rows):
        values = {key: (None if row.get(key, "") == "" else (row[key].lower() == "true" if row[key].lower() in ("true", "false") else float(row[key]))) for key in Features.__dataclass_fields__}
        case = export_case(f"case-{i + 1}", row["decision"], Features(**values)); case["feature_values"] = json.dumps(case["feature_values"], sort_keys=True); output.append(case)
    fields = ["case_id", "deterministic_decision", "feature_values", "numeric_template_explanation", "llm_explanation", "consistency_check"]
    with Path(args.output).open("w", newline="", encoding="utf-8") as f: writer = csv.DictWriter(f, fieldnames=fields); writer.writeheader(); writer.writerows(output)
    study_rows = []
    for case in output:
        study_rows.extend([
            {"case_id": case["case_id"], "condition": "A_DECISION_ONLY", "presentation": case["deterministic_decision"], "participant_response": ""},
            {"case_id": case["case_id"], "condition": "B_NUMERICAL_EXPLANATION", "presentation": case["numeric_template_explanation"], "participant_response": ""},
            {"case_id": case["case_id"], "condition": "C_LLM_EXPLANATION", "presentation": case["llm_explanation"] or "[LLM explanation not generated]", "participant_response": ""},
        ])
    with Path(args.study_output).open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=("case_id", "condition", "presentation", "participant_response")); writer.writeheader(); writer.writerows(study_rows)
    print(f"Wrote {args.output} and {args.study_output}; no LLM call was made.")
if __name__ == "__main__": main()
