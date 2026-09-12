"""Exposure summaries for a slope unit or region."""

from django.db.models import Sum

from apps.exposure.models import ExposureAsset


def summarize_exposure(*, unit_id: int | None = None, region_id: int | None = None) -> dict[str, object]:
    assets = ExposureAsset.objects.all()
    if region_id is not None:
        assets = assets.filter(region_id=region_id)
    if unit_id is not None:
        assets = assets.filter(unit_id=unit_id)
    by_kind = {kind: assets.filter(kind=kind).count() for kind, _ in ExposureAsset.Kind.choices}
    return {
        "asset_count": assets.count(),
        "population": assets.aggregate(value=Sum("population"))["value"] or 0,
        "capacity": assets.aggregate(value=Sum("capacity"))["value"] or 0,
        "by_kind": by_kind,
    }


def impact_risk(hazard_probability: float, exposure_score: float) -> float:
    return round(max(0, min(1, hazard_probability)) * max(0, exposure_score), 2)
