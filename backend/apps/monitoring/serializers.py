from rest_framework import serializers

from .models import DynamicObservation, ForecastObservation


class DynamicObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DynamicObservation
        fields = "__all__"


class ForecastObservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForecastObservation
        fields = "__all__"