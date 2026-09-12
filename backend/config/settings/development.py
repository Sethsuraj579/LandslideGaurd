from .base import *  # noqa: F403

DEBUG = True
USE_GIS = os.getenv("USE_GIS", "false").lower() == "true"
ALLOWED_HOSTS = [*ALLOWED_HOSTS, "testserver"]

