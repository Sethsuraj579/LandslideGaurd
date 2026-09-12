from django.db import models
from apps.geo.fields import PointField
from apps.geo.models import Region, SlopeUnit

class ExposureAsset(models.Model):
    class Kind(models.TextChoices): ROAD="road"; BRIDGE="bridge"; HOSPITAL="hospital"; SCHOOL="school"; VILLAGE="village"; POWER="power"; RAIL="rail"; TOURIST="tourist"
    kind = models.CharField(max_length=16, choices=Kind.choices)
    region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.CASCADE, related_name="exposure_assets")
    unit = models.ForeignKey(SlopeUnit, null=True, blank=True, on_delete=models.CASCADE, related_name="exposure_assets")
    geom = PointField()
    name = models.CharField(max_length=120)
    population = models.PositiveIntegerField(default=0)
    capacity = models.PositiveIntegerField(default=0)
    criticality = models.PositiveSmallIntegerField(default=1)
