from celery import shared_task

from .models import Alert


@shared_task
def process_open_alerts() -> int:
    return Alert.objects.filter(status=Alert.Status.NEW).count()