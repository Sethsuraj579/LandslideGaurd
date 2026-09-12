from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.geo.models import SlopeUnit
from apps.explain.services import explain_drivers

@api_view(["GET"])
def explain(_: object, unit_id: int) -> Response:
    unit=get_object_or_404(SlopeUnit,pk=unit_id); latest=unit.risk_snapshots.first()
    return Response({"unit":unit.id, **explain_drivers(latest.drivers if latest else {})})
