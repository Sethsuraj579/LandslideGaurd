from django.db import models
from apps.geo.models import SlopeUnit

class DynamicObservation(models.Model):
    unit = models.ForeignKey(SlopeUnit, on_delete=models.CASCADE, related_name="observations")
    ts = models.DateTimeField(db_index=True)
    rain_1h_mm = models.FloatField(default=0)
    rain_24h_mm = models.FloatField(default=0)
    rain_72h_mm = models.FloatField(default=0)
    intensity_mm_h = models.FloatField(default=0)
    soil_moisture_pct = models.FloatField(default=0)
    temp_c = models.FloatField(default=0)
    source = models.CharField(max_length=80, default="demo")
    class Meta: ordering = ["-ts"]; indexes = [models.Index(fields=["unit", "-ts"])]

class ForecastObservation(models.Model):
    unit = models.ForeignKey(SlopeUnit, on_delete=models.CASCADE, related_name="forecasts")
    valid_from = models.DateTimeField()
    valid_to = models.DateTimeField()
    rain_mm = models.FloatField(default=0)
    soil_moisture_pred = models.FloatField(default=0)
    source = models.CharField(max_length=80, default="demo")
