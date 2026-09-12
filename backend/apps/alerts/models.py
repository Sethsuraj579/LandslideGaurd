from django.db import models
from apps.geo.models import Region, SlopeUnit

class Alert(models.Model):
    class Status(models.TextChoices): NEW="new"; ACK="ack"; RESOLVED="resolved"
    unit = models.ForeignKey(SlopeUnit, null=True, blank=True, on_delete=models.CASCADE, related_name="alerts")
    region = models.ForeignKey(Region, null=True, blank=True, on_delete=models.CASCADE, related_name="alerts")
    level = models.CharField(max_length=10)
    window_start = models.DateTimeField()
    window_end = models.DateTimeField()
    message = models.TextField()
    drivers = models.JSONField(default=dict)
    recommended_action = models.TextField()
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.NEW)
    false_alarm_flag = models.BooleanField(default=False)
    issued_at = models.DateTimeField(auto_now_add=True)
