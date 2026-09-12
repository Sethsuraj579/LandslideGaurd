from django.db import models
from apps.geo.models import SlopeUnit

class SusceptibilityScore(models.Model):
    unit = models.ForeignKey(SlopeUnit, on_delete=models.CASCADE, related_name="susceptibility_scores")
    model_version = models.CharField(max_length=64)
    score = models.FloatField()
    probability = models.FloatField()
    shap_values = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

class RiskSnapshot(models.Model):
    class Level(models.TextChoices): LOW="LOW"; WATCH="WATCH"; WARNING="WARNING"; CRITICAL="CRITICAL"
    unit = models.ForeignKey(SlopeUnit, on_delete=models.CASCADE, related_name="risk_snapshots")
    ts = models.DateTimeField(db_index=True)
    static_risk = models.FloatField()
    dynamic_risk = models.FloatField()
    exposure_score = models.FloatField(default=0)
    fused_risk = models.FloatField()
    velocity = models.FloatField(default=0)
    level = models.CharField(max_length=10, choices=Level.choices)
    drivers = models.JSONField(default=dict)
    weights = models.JSONField(default=dict)
    class Meta: ordering=["-ts"]; indexes=[models.Index(fields=["unit", "-ts"])]
