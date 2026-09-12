"""Static susceptibility inference against a registered model artifact."""

from pathlib import Path
from typing import Any

import joblib


class ModelArtifactError(RuntimeError):
    """Raised when a configured model artifact cannot be loaded."""


def predict_static(features: dict[str, Any], artifact_path: str) -> dict[str, float | str]:
    if not features:
        raise ValueError("At least one feature is required for susceptibility inference")
    artifact = Path(artifact_path)
    if not artifact.exists():
        raise ModelArtifactError(f"Model artifact does not exist: {artifact}")
    model = joblib.load(artifact)
    columns = getattr(model, "feature_names_in_", list(features))
    missing = [column for column in columns if column not in features]
    if missing:
        raise ValueError(f"Missing model features: {', '.join(missing)}")
    row = [[features[column] for column in columns]]
    probability = float(model.predict_proba(row)[0][1]) if hasattr(model, "predict_proba") else float(model.predict(row)[0])
    return {"score": round(probability * 100, 2), "probability": round(probability, 6), "model": str(artifact)}