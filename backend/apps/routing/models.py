from django.db import models
from apps.geo.fields import LineStringField

class RoadSegment(models.Model):
    geom = LineStringField()
    road_class = models.CharField(max_length=32)
    surface = models.CharField(max_length=32)
    has_bridge = models.BooleanField(default=False)
    from_node = models.CharField(max_length=64)
    to_node = models.CharField(max_length=64)
    length_m = models.FloatField()
    risk_penalty = models.FloatField(default=0)
