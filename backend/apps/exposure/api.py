from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import summarize_exposure


@api_view(["GET"])
def exposure_summary(request):
    return Response(summarize_exposure(unit_id=request.query_params.get("unit_id"), region_id=request.query_params.get("region_id")))