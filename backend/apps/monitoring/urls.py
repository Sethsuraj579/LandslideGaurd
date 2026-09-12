from django.urls import path

from .api import ForecastList, ObservationList

urlpatterns = [
    path("observations/", ObservationList.as_view()),
    path("forecast/", ForecastList.as_view()),
]