from __future__ import annotations
from dataclasses import dataclass

WEIGHTS = {"static": .35, "rainfall": .30, "moisture": .25, "antecedent": .10}

def clamp(value: float) -> float: return max(0.0, min(100.0, value))
def level_for(score: float) -> str:
    return "LOW" if score < 25 else "WATCH" if score < 50 else "WARNING" if score < 70 else "CRITICAL"
@dataclass(frozen=True)
class RiskResult:
    score: float; level: str; terms: dict[str, float]
def fuse_risk(static: float, rainfall: float, moisture: float, antecedent: float, weights: dict[str, float] | None = None) -> RiskResult:
    actual = weights or WEIGHTS
    if round(sum(actual.values()), 8) != 1: raise ValueError("Risk fusion weights must sum to 1")
    terms = {"static": clamp(static), "rainfall": clamp(rainfall), "moisture": clamp(moisture), "antecedent": clamp(antecedent)}
    score = round(sum(terms[key] * actual[key] for key in terms), 2)
    return RiskResult(score=score, level=level_for(score), terms=terms)
def risk_velocity(current: float, previous: float, elapsed_hours: float) -> float:
    if elapsed_hours <= 0: raise ValueError("elapsed_hours must be positive")
    return round((current - previous) / elapsed_hours, 2)


def risk_trend(current: float, previous: float, elapsed_hours: float) -> str:
    velocity = risk_velocity(current, previous, elapsed_hours)
    return "INCREASING" if velocity > 0.01 else "DECREASING" if velocity < -0.01 else "STABLE"
