from apps.risk.services import fuse_risk

def simulate(static: float, rainfall: float, moisture: float, antecedent: float, rainfall_delta_pct: float, moisture_delta: float) -> dict[str, object]:
    before = fuse_risk(static, rainfall, moisture, antecedent)
    after = fuse_risk(static, rainfall * (1 + rainfall_delta_pct / 100), moisture + moisture_delta, antecedent)
    return {"before": before.score, "after": after.score, "delta": round(after.score - before.score, 2), "level": after.level}
