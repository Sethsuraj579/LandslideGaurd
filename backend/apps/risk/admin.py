from django.contrib import admin

from .models import RiskSnapshot, SusceptibilityScore

admin.site.register((RiskSnapshot, SusceptibilityScore))