from rest_framework.decorators import api_view
from rest_framework.response import Response

from .services import simulate


@api_view(["POST"])
def run_simulation(request):
    required = ("static", "rainfall", "moisture", "antecedent")
    if any(key not in request.data for key in required):
        return Response({"detail": "static, rainfall, moisture, and antecedent are required"}, status=400)
    result = simulate(*(float(request.data[key]) for key in required), float(request.data.get("rainfall_delta_pct", 0)), float(request.data.get("soil_moisture_delta", 0)))
    return Response(result)