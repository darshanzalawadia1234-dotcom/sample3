"""
API Routers package.
"""

from .health import router as health_router
from .auth import router as auth_router
from .vessels import router as vessels_router
from .ships import router as ships_router
from .sea_ice import router as sea_ice_router
from .icebergs import router as icebergs_router
from .weather import router as weather_router
from .ocean import router as ocean_router
from .route import router as route_router

__all__ = [
    "health_router",
    "auth_router",
    "vessels_router",
    "ships_router",
    "sea_ice_router",
    "icebergs_router",
    "weather_router",
    "ocean_router",
    "route_router"
]
