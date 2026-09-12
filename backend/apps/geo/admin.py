from django.contrib import admin

from .models import HistoricalLandslide, Region, SlopeUnit, StaticFeature

admin.site.register((Region, SlopeUnit, StaticFeature, HistoricalLandslide))