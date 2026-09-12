from rest_framework import serializers

from .models import HistoricalLandslide, Region, SlopeUnit, StaticFeature


class RegionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Region
        fields = "__all__"


class SlopeUnitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlopeUnit
        fields = "__all__"


class StaticFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = StaticFeature
        fields = "__all__"


class HistoricalLandslideSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoricalLandslide
        fields = "__all__"