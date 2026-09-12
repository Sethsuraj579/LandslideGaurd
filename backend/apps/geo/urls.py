from django.urls import path

from .api import HistoricalLandslideList, RegionList, SlopeUnitList

urlpatterns = [
    path("regions/", RegionList.as_view()),
    path("slope-units/", SlopeUnitList.as_view()),
    path("historical-landslides/", HistoricalLandslideList.as_view()),
]