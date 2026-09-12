"""Create a small deterministic, clearly marked synthetic demo scenario."""
from datetime import timedelta
from django.conf import settings
from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.geo.models import Region, SlopeUnit, StaticFeature
from apps.monitoring.models import DynamicObservation
from apps.risk.models import RiskSnapshot
from apps.risk.services import fuse_risk, risk_velocity
from apps.alerts.models import Alert

class Command(BaseCommand):
    help = "Seed deterministic synthetic LandslideGuard data. It never fetches external data."
    def handle(self, *args: object, **options: object) -> None:
        if settings.USE_GIS:
            from django.contrib.gis.geos import MultiPolygon, Point, Polygon

        def point(x: float, y: float) -> object:
            return Point(x, y) if settings.USE_GIS else {"type": "Point", "coordinates": [x, y]}

        def polygon(x: float, y: float, width: float, height: float) -> object:
            if settings.USE_GIS:
                return Polygon(((x,y),(x+width,y),(x+width,y+height),(x,y+height),(x,y)))
            return {"type": "Polygon", "coordinates": [[[x,y],[x+width,y],[x+width,y+height],[x,y+height],[x,y]]]}

        def multipolygon(x: float, y: float, width: float, height: float) -> object:
            if settings.USE_GIS:
                return MultiPolygon(polygon(x, y, width, height))
            return {"type": "MultiPolygon", "coordinates": [[[[x,y],[x+width,y],[x+width,y+height],[x,y+height],[x,y]]]]}

        Region.objects.all().delete()
        region=Region.objects.create(name="Demo Hills District",code="DEMO-HILLS",boundary=multipolygon(91.70,25.40,.04,.04),centroid=point(91.72,25.42),metadata={"data_mode":"synthetic-demo"})
        stages=[(31,28,35,30),(38,46,42,38),(52,65,70,58),(61,88,82,72)]
        now=timezone.now().replace(minute=0,second=0,microsecond=0)
        for index in range(12):
            x=91.702+(index%4)*.009; y=25.402+(index//4)*.011
            unit=SlopeUnit.objects.create(region=region,geom=polygon(x,y,.006,.006),centroid=point(x+.003,y+.003),area_ha=44,unit_code=f"DEMO-{index+1:03}")
            StaticFeature.objects.create(unit=unit,elevation_m=520+index*35,slope_deg=18+index*2,aspect_deg=140,soil_type="loam",lithology="weathered sandstone",lulc="mixed forest",drainage_density=1.4,fault_distance_m=700,hist_landslide_density=.2)
            previous=0.0
            for step,(static,rain,moisture,antecedent) in enumerate(stages):
                fused=fuse_risk(static+index*.35,rain,moisture,antecedent)
                ts=now-timedelta(hours=(len(stages)-step)*3)
                DynamicObservation.objects.create(unit=unit,ts=ts,rain_1h_mm=rain/8,rain_24h_mm=rain,rain_72h_mm=antecedent,intensity_mm_h=rain/8,soil_moisture_pct=moisture,source="synthetic-demo")
                RiskSnapshot.objects.create(unit=unit,ts=ts,static_risk=static,dynamic_risk=(rain+moisture)/2,exposure_score=25,fused_risk=fused.score,velocity=risk_velocity(fused.score,previous,3) if step else 0,level=fused.level,drivers={**fused.terms,"source":"synthetic-demo"},weights={"static":.35,"rainfall":.30,"moisture":.20,"antecedent":.15})
                previous=fused.score
        unit=SlopeUnit.objects.get(unit_code="DEMO-001")
        snapshot=unit.risk_snapshots.first()
        Alert.objects.create(unit=unit,region=region,level=snapshot.level,window_start=now,window_end=now+timedelta(hours=6),message="EARLY WARNING — Synthetic demo conditions predict elevated landslide risk within 3–6 hours.",drivers=snapshot.drivers,recommended_action="Inspect the vulnerable road corridor and notify local response teams.")
        self.stdout.write(self.style.SUCCESS("Seeded deterministic SYNTHETIC demo data: 1 district, 12 slope units, 48 observations."))
