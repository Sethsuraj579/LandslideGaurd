"""Generate risk scores from a trained static susceptibility artifact."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import joblib
import pandas as pd

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

try:
    from src.utils.config import MODELS_DIR, PREDICTIONS_DIR, PROCESSED_DIR
    from src.models.train import demo_dataset
except ModuleNotFoundError:
    from utils.config import MODELS_DIR, PREDICTIONS_DIR, PROCESSED_DIR
    from train import demo_dataset


def level_for(score: float) -> str:
    return "LOW" if score < 25 else "WATCH" if score < 50 else "WARNING" if score < 70 else "CRITICAL"


def predict_file(input_path: Path, artifact_path: Path = MODELS_DIR / "random_forest.pkl", output_path: Path = PREDICTIONS_DIR / "current_risk.csv") -> pd.DataFrame:
    if not artifact_path.exists():
        raise FileNotFoundError(f"Model artifact not found: {artifact_path}. Run train.py first.")
    bundle = joblib.load(artifact_path)
    frame = pd.read_csv(input_path)
    features = bundle["features"]
    missing = [column for column in features if column not in frame.columns]
    if missing:
        raise ValueError(f"Prediction data is missing columns: {', '.join(missing)}")
    probabilities = bundle["model"].predict_proba(frame[features])[:, 1]
    result = pd.DataFrame({"location_id": frame.get("location_id", pd.Series(range(len(frame)))), "risk_score": (probabilities * 100).round(2)})
    result["risk_level"] = result["risk_score"].map(level_for)
    result["timestamp"] = pd.Timestamp.now(tz="UTC").isoformat()
    output_path.parent.mkdir(parents=True, exist_ok=True)
    result.to_csv(output_path, index=False)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=PROCESSED_DIR / "training_dataset.csv")
    parser.add_argument("--model", type=Path, default=MODELS_DIR / "random_forest.pkl")
    parser.add_argument("--output", type=Path, default=PREDICTIONS_DIR / "current_risk.csv")
    parser.add_argument("--demo", action="store_true", help="Predict on deterministic synthetic data")
    args = parser.parse_args()
    if args.demo:
        demo_input = args.input.with_name("_demo_prediction_input.csv")
        demo_dataset().to_csv(demo_input, index=False)
        try:
            print(predict_file(demo_input, args.model, args.output).head())
        finally:
            demo_input.unlink(missing_ok=True)
    else:
        print(predict_file(args.input, args.model, args.output).head())


if __name__ == "__main__":
    main()