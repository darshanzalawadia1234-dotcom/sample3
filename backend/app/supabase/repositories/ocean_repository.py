from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

class OceanRepository:
    def get_latest(self, lat: float = -64.82, lon: float = -58.25) -> Dict[str, Any]:
        """Fetch nearest ocean observation from Supabase."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("ocean_observations").select("*").order("observation_time", desc=True).limit(1).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase ocean query failed ({e}), using local db.")

        with SessionLocal() as db:
            obs = db.scalar(
                select(models.OceanObservation)
                .order_by(desc(models.OceanObservation.observation_time))
                .limit(1)
            )
            if obs:
                return {
                    "id": obs.id,
                    "latitude": obs.latitude,
                    "longitude": obs.longitude,
                    "observation_time": obs.observation_time.isoformat() if obs.observation_time else None,
                    "water_temperature": obs.water_temperature,
                    "current_speed": obs.current_speed,
                    "current_direction": obs.current_direction,
                    "wave_height": obs.wave_height,
                    "source": obs.source
                }

        # Baseline fallback
        return {
            "latitude": lat,
            "longitude": lon,
            "observation_time": datetime.now(timezone.utc).isoformat(),
            "water_temperature": -1.2,
            "current_speed": 1.4,
            "current_direction": 195.0,
            "wave_height": 2.8,
            "source": "DEMO_SYNTHETIC"
        }

ocean_repository = OceanRepository()
