from django.contrib import admin
from django.http import JsonResponse
from django.urls import path
from django.urls import include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.risk import api as risk_api
from apps.alerts import api as alerts_api
from apps.explain import api as explain_api


def health(_: object) -> JsonResponse:
    return JsonResponse({"service": "landslideguard-api", "status": "phase-1-ready"})


urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health),
    path("api/v1/health/", health),
    path("api/v1/geo/", include("apps.geo.urls")),
    path("api/v1/monitoring/", include("apps.monitoring.urls")),
    path("api/v1/exposure/", include("apps.exposure.urls")),
    path("api/v1/routes/", include("apps.routing.urls")),
    path("api/v1/simulations/", include("apps.simulation.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/schema/swagger-ui/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/v1/risk/summary/", risk_api.summary),
    path("api/v1/risk/history/", risk_api.history),
    path("api/v1/units/", risk_api.units),
    path("api/v1/units/<int:unit_id>/risk/", risk_api.unit_risk),
    path("api/v1/simulate/", risk_api.simulate),
    path("api/v1/alerts/", alerts_api.alerts),
    path("api/v1/alerts/<int:alert_id>/ack/", alerts_api.acknowledge),
    path("api/v1/explain/<int:unit_id>/", explain_api.explain),
]
