from django.db import models
from .fields import MultiPolygonField, PointField, PolygonField

class Region(models.Model):
    name = models.CharField(max_length=120)
    code = models.CharField(max_length=32, unique=True)
    metadata = models.JSONField(default=dict, blank=True)
    boundary = MultiPolygonField()
    centroid = PointField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta: ordering = ["name"]
    def __str__(self) -> str: return self.name

class SlopeUnit(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="slope_units")
    geom = PolygonField()
    centroid = PointField()
    area_ha = models.FloatField()
    unit_code = models.CharField(max_length=64, unique=True)
    class Meta: indexes = [models.Index(fields=["region", "unit_code"])]
    def __str__(self) -> str: return self.unit_code

class StaticFeature(models.Model):
    unit = models.OneToOneField(SlopeUnit, on_delete=models.CASCADE, related_name="static_features")
    elevation_m = models.FloatField()
    slope_deg = models.FloatField()
    aspect_deg = models.FloatField(default=0)
    soil_type = models.CharField(max_length=80)
    lithology = models.CharField(max_length=80)
    lulc = models.CharField(max_length=80)
    drainage_density = models.FloatField(default=0)
    fault_distance_m = models.FloatField(default=0)
    hist_landslide_density = models.FloatField(default=0)

class HistoricalLandslide(models.Model):
    region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.SET_NULL, related_name="historical_landslides")
    geom = PointField()
    occurred_on = models.DateField()
    landslide_type = models.CharField(max_length=64)
    severity = models.CharField(max_length=32, blank=True)
    volume_m3 = models.FloatField(null=True, blank=True)
    source = models.CharField(max_length=120)
    metadata = models.JSONField(default=dict, blank=True)
    verified = models.BooleanField(default=False)
