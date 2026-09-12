"""Evaluate a trained susceptibility artifact on labelled CSV data."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, roc_auc_score

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

try:
    from src.models.train import FEATURES, TARGET, demo_dataset
    from src.utils.config import MODELS_DIR, PROCESSED_DIR
except ModuleNotFoundError:
    from train import FEATURES, TARGET, demo_dataset
    from utils.config import MODELS_DIR, PROCESSED_DIR


def evaluate(data: pd.DataFrame, artifact_path: Path = MODELS_DIR / "random_forest.pkl") -> dict[str, object]:
    if not artifact_path.exists():
        raise FileNotFoundError(f"Model artifact not found: {artifact_path}. Run train.py first.")
    bundle = joblib.load(artifact_path)
    probabilities = bundle["model"].predict_proba(data[FEATURES])[:, 1]
    predicted = (probabilities >= .5).astype(int)
    return {"accuracy": round(float(accuracy_score(data[TARGET], predicted)), 4), "roc_auc": round(float(roc_auc_score(data[TARGET], probabilities)), 4), "report": classification_report(data[TARGET], predicted, output_dict=True, zero_division=0)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=PROCESSED_DIR / "training_dataset.csv")
    parser.add_argument("--model", type=Path, default=MODELS_DIR / "random_forest.pkl")
    parser.add_argument("--demo", action="store_true")
    args = parser.parse_args()
    data = demo_dataset() if args.demo else pd.read_csv(args.input)
    print(evaluate(data, args.model))


if __name__ == "__main__":
    main()