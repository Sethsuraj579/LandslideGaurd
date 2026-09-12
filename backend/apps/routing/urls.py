from django.urls import path

from .api import route

urlpatterns = [path("", route)]