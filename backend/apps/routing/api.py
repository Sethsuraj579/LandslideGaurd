from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import calculate_route


@api_view(["GET"])
def route(request):
    start = request.query_params.get("start")
    end = request.query_params.get("end")
    if not start or not end:
        return Response({"detail": "start and end query parameters are required"}, status=400)
    try:
        return Response(calculate_route(start, end, request.query_params.get("risk_aware", "true").lower() != "false"))
    except ValueError as error:
        return Response({"detail": str(error)}, status=400)