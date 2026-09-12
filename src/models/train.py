"""Train and persist the LandslideGuard static susceptibility model."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder

sys.path.insert(0, str(Path(__file__).resolve().parents[2]))

try:
    from src.utils.config import MODELS_DIR, PROCESSED_DIR
except ModuleNotFoundError:
    from utils.config import MODELS_DIR, PROCESSED_DIR

FEATURES = ["elevation", "slope", "aspect", "soil_type", "geology", "landcover", "rainfall_mm"]
TARGET = "label"


def demo_dataset(rows: int = 160) -> pd.DataFrame:
    rng = np.random.default_rng(42)
    frame = pd.DataFrame({
        "location_id": [f"DEMO-{index:04d}" for index in range(rows)],
        "date": pd.date_range("2026-01-01", periods=rows, freq="h"),
        "elevation": rng.normal(650, 180, rows).clip(100, 1400),
        "slope": rng.normal(28, 10, rows).clip(2, 60),
        "aspect": rng.uniform(0, 360, rows),
        "soil_type": rng.choice(["loam", "clay", "sandy"], rows),
        "geology": rng.choice(["sandstone", "shale", "granite"], rows),
        "landcover": rng.choice(["forest", "cropland", "urban"], rows),
        "rainfall_mm": rng.gamma(3, 18, rows).clip(0, 220),
    })
    score = frame["slope"] * 1.2 + frame["rainfall_mm"] * 0.55 + (frame["soil_type"] == "clay") * 14
    frame[TARGET] = (score > score.median()).astype(int)
    return frame


def build_model() -> Pipeline:
    categorical = ["soil_type", "geology", "landcover"]
    numeric = [feature for feature in FEATURES if feature not in categorical]
    preprocessing = ColumnTransformer([
        ("numeric", "passthrough", numeric),
        ("categorical", OneHotEncoder(handle_unknown="ignore"), categorical),
    ])
    return Pipeline([("preprocessing", preprocessing), ("model", RandomForestClassifier(n_estimators=180, random_state=42, class_weight="balanced"))])


def train_model(data: pd.DataFrame, artifact_path: Path | None = None) -> dict[str, float | str]:
    missing = [column for column in [*FEATURES, TARGET] if column not in data.columns]
    if missing:
        raise ValueError(f"Training data is missing columns: {', '.join(missing)}")
    if len(data) < 10:
        raise ValueError("At least 10 training rows are required")
    x_train, x_test, y_train, y_test = train_test_split(data[FEATURES], data[TARGET].astype(int), test_size=.25, random_state=42, stratify=data[TARGET])
    model = build_model().fit(x_train, y_train)
    probabilities = model.predict_proba(x_test)[:, 1]
    metrics = {"accuracy": round(float(accuracy_score(y_test, probabilities >= .5)), 4), "roc_auc": round(float(roc_auc_score(y_test, probabilities)), 4), "rows": len(data)}
    destination = artifact_path or MODELS_DIR / "random_forest.pkl"
    destination.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump({"model": model, "features": FEATURES, "metrics": metrics}, destination)
    return {**metrics, "artifact": str(destination)}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, default=PROCESSED_DIR / "training_dataset.csv")
    parser.add_argument("--demo", action="store_true", help="Train on deterministic synthetic data")
    args = parser.parse_args()
    data = demo_dataset() if args.demo else pd.read_csv(args.input)
    print(train_model(data))


if __name__ == "__main__":
    main()