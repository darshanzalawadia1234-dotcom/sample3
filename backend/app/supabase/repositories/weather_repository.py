from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

class WeatherRepository:
    def get_latest(self, lat: float = -64.82, lon: float = -58.25) -> Dict[str, Any]:
        """Fetch nearest weather observation from Supabase."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("weather_observations").select("*").order("observation_time", desc=True).limit(1).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase weather query failed ({e}), using local db.")

        with SessionLocal() as db:
            obs = db.scalar(
                select(models.WeatherObservation)
                .order_by(desc(models.WeatherObservation.observation_time))
                .limit(1)
            )
            if obs:
                return {
                    "id": obs.id,
                    "latitude": obs.latitude,
                    "longitude": obs.longitude,
                    "observation_time": obs.observation_time.isoformat() if obs.observation_time else None,
                    "temperature": obs.temperature,
                    "wind_speed": obs.wind_speed,
                    "wind_direction": obs.wind_direction,
                    "pressure": obs.pressure,
                    "precipitation": obs.precipitation,
                    "wave_height": obs.wave_height,
                    "source": obs.source
                }

        # Baseline fallback
        return {
            "latitude": lat,
            "longitude": lon,
            "observation_time": datetime.now(timezone.utc).isoformat(),
            "temperature": -7.4,
            "wind_speed": 26.5,
            "wind_direction": 215.0,
            "pressure": 982.0,
            "precipitation": 0.2,
            "wave_height": 2.8,
            "source": "DEMO_SYNTHETIC"
        }

weather_repository = WeatherRepository()
