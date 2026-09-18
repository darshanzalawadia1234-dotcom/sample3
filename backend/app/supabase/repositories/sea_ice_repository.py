from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

class SeaIceRepository:
    def get_latest_observations(self, limit: int = 50) -> List[Dict[str, Any]]:
        """Retrieve recent sea-ice observations."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("sea_ice_observations").select("*").order("observation_time", desc=True).limit(limit).execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase sea_ice_observations query failed ({e}), using local db.")

        with SessionLocal() as db:
            stmt = select(models.SeaIceObservation).order_by(desc(models.SeaIceObservation.observation_time)).limit(limit)
            records = db.scalars(stmt).all()
            return [
                {
                    "id": r.id,
                    "latitude": r.latitude,
                    "longitude": r.longitude,
                    "observation_time": r.observation_time.isoformat() if r.observation_time else None,
                    "ice_concentration": r.ice_concentration,
                    "ice_extent": r.ice_extent,
                    "surface_temperature": r.surface_temperature,
                    "source": r.source
                }
                for r in records
            ]

    def save_prediction(self, prediction_data: Dict[str, Any]) -> Dict[str, Any]:
        """Save a generated sea-ice prediction to Supabase."""
        payload = {
            "latitude": float(prediction_data.get("latitude", -70.5)),
            "longitude": float(prediction_data.get("longitude", -45.0)),
            "prediction_time": prediction_data.get("prediction_time", datetime.now(timezone.utc).isoformat()),
            "target_time": prediction_data.get("target_time", datetime.now(timezone.utc).isoformat()),
            "predicted_concentration": float(prediction_data.get("predicted_concentration", 0.0)),
            "confidence": float(prediction_data.get("confidence", 85.0)),
            "model_version": prediction_data.get("model_version", "v1.0"),
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("sea_ice_predictions").insert(payload).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase sea_ice_predictions insert failed ({e}), saving locally.")

        with SessionLocal() as db:
            target_dt = datetime.fromisoformat(payload["target_time"]) if isinstance(payload["target_time"], str) else payload["target_time"]
            pred = models.SeaIcePrediction(
                latitude=payload["latitude"],
                longitude=payload["longitude"],
                target_time=target_dt,
                predicted_concentration=payload["predicted_concentration"],
                confidence=payload["confidence"],
                model_version=payload["model_version"]
            )
            db.add(pred)
            db.commit()
            db.refresh(pred)
            return {
                "id": pred.id,
                **payload
            }

sea_ice_repository = SeaIceRepository()
