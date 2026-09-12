def explain_drivers(drivers: dict[str, float], limit: int = 4) -> dict[str, object]:
    ranked = sorted(drivers.items(), key=lambda item: abs(item[1]), reverse=True)[:limit]
    names = [key.replace("_", " ") for key, _ in ranked]
    return {"drivers": [{"feature": key, "contribution": value} for key, value in ranked], "summary": f"Primary risk drivers: {', '.join(names)}." if names else "No contributing factors are available."}
