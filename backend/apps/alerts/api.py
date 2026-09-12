from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from apps.alerts.models import Alert

def alert_data(item: Alert) -> dict[str, object]:
    return {"id":item.id,"level":item.level,"status":item.status,"message":item.message,"drivers":item.drivers,"recommended_action":item.recommended_action,"issued_at":item.issued_at,"unit":item.unit_id}
@api_view(["GET"])
def alerts(request: object) -> Response:
    items=Alert.objects.all()
    if request.query_params.get("status"): items=items.filter(status=request.query_params["status"])
    if request.query_params.get("level"): items=items.filter(level=request.query_params["level"])
    return Response({"results":[alert_data(item) for item in items[:100]]})
@api_view(["POST"])
def acknowledge(_: object, alert_id: int) -> Response:
    alert=get_object_or_404(Alert,pk=alert_id); alert.status=Alert.Status.ACK; alert.save(update_fields=["status"])
    return Response(alert_data(alert))
