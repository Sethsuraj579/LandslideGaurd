from django.urls import path

from .api import exposure_summary

urlpatterns = [path("", exposure_summary)]