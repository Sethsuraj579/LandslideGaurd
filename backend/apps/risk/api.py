from datetime import timedelta
from django.db.models import Avg, Count
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.geo.models import SlopeUnit
from apps.risk.models import RiskSnapshot
from apps.risk.services import fuse_risk
from apps.monitoring.models import DynamicObservation

def snapshot_data(item: RiskSnapshot) -> dict[str, object]:
    return {"id": item.id, "unit": item.unit_id, "timestamp": item.ts, "static_risk": item.static_risk, "dynamic_risk": item.dynamic_risk, "fused_risk": item.fused_risk, "velocity": item.velocity, "level": item.level, "drivers": item.drivers}

@api_view(["GET"])
def summary(_: object) -> Response:
    latest_ids = RiskSnapshot.objects.values("unit").annotate(latest=__import__("django.db.models", fromlist=["Max"]).Max("ts"))
    snapshots = RiskSnapshot.objects.filter(ts__in=[item["latest"] for item in latest_ids])
    return Response({"data_mode": "demo" if snapshots.exists() else "unseeded", "units_monitored": snapshots.count(), "average_risk": snapshots.aggregate(value=Avg("fused_risk"))["value"] or 0, "by_level": {level: snapshots.filter(level=level).count() for level in RiskSnapshot.Level.values}, "latest": [snapshot_data(item) for item in snapshots[:10]]})

@api_view(["GET"])
def units(_: object) -> Response:
    data=[]
    for unit in SlopeUnit.objects.select_related("region").prefetch_related("risk_snapshots")[:200]:
        latest = unit.risk_snapshots.first()
        data.append({"id":unit.id,"code":unit.unit_code,"region":unit.region.name,"centroid":[unit.centroid.x,unit.centroid.y],"risk": snapshot_data(latest) if latest else None})
    return Response({"results": data})


@api_view(["GET"])
def history(request: object) -> Response:
    items = RiskSnapshot.objects.all()
    unit_id = request.query_params.get("unit_id")
    level = request.query_params.get("level")
    if unit_id:
        items = items.filter(unit_id=unit_id)
    if level:
        items = items.filter(level=level.upper())
    return Response({"results": [snapshot_data(item) for item in items[:200]]})

@api_view(["GET"])
def unit_risk(_: object, unit_id: int) -> Response:
    unit=get_object_or_404(SlopeUnit, pk=unit_id)
    window = _.query_params.get("window", "24h") if hasattr(_, "query_params") else "24h"
    hours={"24h":24,"7d":168,"30d":720}.get(window,24)
    items=RiskSnapshot.objects.filter(unit=unit,ts__gte=timezone.now()-timedelta(hours=hours)).order_by("ts")
    return Response({"unit":unit.id,"results":[snapshot_data(item) for item in items]})

@api_view(["POST"])
def simulate(request: object) -> Response:
    from apps.simulation.services import simulate as simulate_risk
    payload=request.data
    unit=get_object_or_404(SlopeUnit,pk=payload.get("unit_id"))
    latest=unit.risk_snapshots.first()
    if not latest: return Response({"detail":"No risk snapshot for unit"},status=status.HTTP_404_NOT_FOUND)
    drivers=latest.drivers
    result=simulate_risk(latest.static_risk,drivers.get("rainfall",latest.dynamic_risk),drivers.get("moisture",0),drivers.get("antecedent",0),float(payload.get("rainfall_delta_pct",0)),float(payload.get("soil_moisture_delta",0)))
    return Response({"unit":unit.id,"simulation":result})
