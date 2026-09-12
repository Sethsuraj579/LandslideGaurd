"""Risk trend calculations for persisted snapshots."""

from dataclasses import dataclass
from datetime import datetime


@dataclass(frozen=True)
class RiskTrend:
    velocity: float
    direction: str


def calculate_velocity(current: float, previous: float, elapsed_hours: float) -> RiskTrend:
    if elapsed_hours <= 0:
        raise ValueError("elapsed_hours must be positive")
    velocity = round((current - previous) / elapsed_hours, 2)
    direction = "INCREASING" if velocity > 0.01 else "DECREASING" if velocity < -0.01 else "STABLE"
    return RiskTrend(velocity=velocity, direction=direction)


def snapshot_velocity(current_timestamp: datetime, current_score: float, previous_timestamp: datetime, previous_score: float) -> RiskTrend:
    elapsed_hours = (current_timestamp - previous_timestamp).total_seconds() / 3600
    return calculate_velocity(current_score, previous_score, elapsed_hours)