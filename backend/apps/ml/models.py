from django.db import models

class ModelVersion(models.Model):
    class Kind(models.TextChoices): STATIC="static"; FUSION="fusion"; ANOMALY="anomaly"
    kind = models.CharField(max_length=16, choices=Kind.choices)
    artifact_path = models.CharField(max_length=255)
    metrics = models.JSONField(default=dict)
    trained_at = models.DateTimeField()
    is_active = models.BooleanField(default=False)
