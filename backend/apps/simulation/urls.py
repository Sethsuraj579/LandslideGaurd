from django.urls import path

from .api import run_simulation

urlpatterns = [path("", run_simulation)]