from django.urls import path

from .consumers import RiskConsumer

websocket_urlpatterns = [path("ws/risk/", RiskConsumer.as_asgi())]