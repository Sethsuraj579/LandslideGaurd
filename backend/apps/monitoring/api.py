from rest_framework import generics

from .models import DynamicObservation, ForecastObservation
from .serializers import DynamicObservationSerializer, ForecastObservationSerializer


class ObservationList(generics.ListCreateAPIView):
    queryset = DynamicObservation.objects.all()
    serializer_class = DynamicObservationSerializer


class ForecastList(generics.ListCreateAPIView):
    queryset = ForecastObservation.objects.all()
    serializer_class = ForecastObservationSerializer