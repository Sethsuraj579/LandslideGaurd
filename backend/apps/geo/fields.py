"""Geometry field compatibility for local development and PostGIS deployments."""

from django.conf import settings
from django.db import models as django_models

if getattr(settings, "USE_GIS", False):
    from django.contrib.gis.db import models as geo_models

    PointField = geo_models.PointField
    PolygonField = geo_models.PolygonField
    MultiPolygonField = geo_models.MultiPolygonField
    LineStringField = geo_models.LineStringField
else:
    PointField = django_models.JSONField
    PolygonField = django_models.JSONField
    MultiPolygonField = django_models.JSONField
    LineStringField = django_models.JSONField