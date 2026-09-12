from django.contrib import admin

from .models import DynamicObservation, ForecastObservation

admin.site.register((DynamicObservation, ForecastObservation))