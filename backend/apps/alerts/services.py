from apps.risk.services import level_for

def should_alert(score: float, velocity: float) -> bool:
    return level_for(score) in {"WARNING", "CRITICAL"} or velocity >= 10
