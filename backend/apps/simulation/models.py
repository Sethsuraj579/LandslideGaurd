from django.conf import settings
from django.db import models

class SimulationRun(models.Model):
    scenario = models.JSONField()
    results = models.JSONField()
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
