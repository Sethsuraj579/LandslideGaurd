from celery import shared_task

from .models import RiskSnapshot


@shared_task
def recalculate_risk_snapshot(snapshot_id: int) -> str:
    snapshot = RiskSnapshot.objects.get(pk=snapshot_id)
    return f"risk snapshot {snapshot.pk} available for recalculation"