from rest_framework import generics

from .models import HistoricalLandslide, Region, SlopeUnit
from .serializers import HistoricalLandslideSerializer, RegionSerializer, SlopeUnitSerializer


class RegionList(generics.ListCreateAPIView):
    queryset = Region.objects.all()
    serializer_class = RegionSerializer


class SlopeUnitList(generics.ListCreateAPIView):
    queryset = SlopeUnit.objects.all()
    serializer_class = SlopeUnitSerializer


class HistoricalLandslideList(generics.ListCreateAPIView):
    queryset = HistoricalLandslide.objects.all()
    serializer_class = HistoricalLandslideSerializer