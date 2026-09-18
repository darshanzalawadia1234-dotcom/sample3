from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

class IcebergRepository:
    def get_all(
        self,
        min_lat: Optional[float] = None,
        max_lat: Optional[float] = None,
        min_lon: Optional[float] = None,
        max_lon: Optional[float] = None
    ) -> List[Dict[str, Any]]:
        """Catalog of radar-tracked icebergs."""
        client = get_supabase_client()
        if client is not None:
            try:
                query = client.table("icebergs").select("*")
                if min_lat is not None:
                    query = query.gte("latitude", min_lat)
                if max_lat is not None:
                    query = query.lte("latitude", max_lat)
                if min_lon is not None:
                    query = query.gte("longitude", min_lon)
                if max_lon is not None:
                    query = query.lte("longitude", max_lon)
                res = query.execute()
                if res.data is not None and len(res.data) > 0:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase icebergs query failed ({e}), using local db.")

        with SessionLocal() as db:
            stmt = select(models.Iceberg)
            if min_lat is not None:
                stmt = stmt.where(models.Iceberg.latitude >= min_lat)
            if max_lat is not None:
                stmt = stmt.where(models.Iceberg.latitude <= max_lat)
            if min_lon is not None:
                stmt = stmt.where(models.Iceberg.longitude >= min_lon)
            if max_lon is not None:
                stmt = stmt.where(models.Iceberg.longitude <= max_lon)
            records = db.scalars(stmt).all()
            return [
                {
                    "id": b.id,
                    "external_id": b.external_id,
                    "latitude": b.latitude,
                    "longitude": b.longitude,
                    "observation_time": b.observation_time.isoformat() if b.observation_time else None,
                    "length": b.length,
                    "width": b.width,
                    "height": b.height,
                    "speed": b.speed,
                    "direction": b.direction,
                    "source": b.source
                }
                for b in records
            ]

    def get_by_id(self, identifier: str) -> Optional[Dict[str, Any]]:
        """Get iceberg by id or external_id."""
        client = get_supabase_client()
        if client is not None:
            try:
                query = client.table("icebergs").select("*")
                if identifier.isdigit():
                    query = query.or_(f"id.eq.{identifier},external_id.eq.{identifier}")
                else:
                    query = query.eq("external_id", identifier)
                res = query.single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_iceberg failed ({e}), using local db.")

        with SessionLocal() as db:
            if identifier.isdigit():
                berg = db.scalar(select(models.Iceberg).where(models.Iceberg.id == int(identifier)))
                if berg:
                    return self._format_iceberg(berg)
            berg = db.scalar(select(models.Iceberg).where(models.Iceberg.external_id == identifier))
            if berg:
                return self._format_iceberg(berg)
        return None

    def save_trajectories(self, iceberg_id: int, trajectory_points: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Save predicted future trajectory coordinates to Supabase."""
        persisted = []
        client = get_supabase_client()

        for pt in trajectory_points:
            # Skip current step
            if pt.get("step") == "CURRENT":
                continue

            target_time = pt.get("target_time") or datetime.now(timezone.utc).isoformat()
            payload = {
                "iceberg_id": iceberg_id,
                "prediction_time": datetime.now(timezone.utc).isoformat(),
                "target_time": target_time,
                "predicted_latitude": float(pt.get("latitude", 0.0)),
                "predicted_longitude": float(pt.get("longitude", 0.0)),
                "probability": float(pt.get("probability", 85.0)) / (100.0 if float(pt.get("probability", 85.0)) > 1.0 else 1.0),
                "model_version": "v1.2",
                "created_at": datetime.now(timezone.utc).isoformat()
            }

            if client is not None:
                try:
                    res = client.table("iceberg_trajectory_predictions").insert(payload).execute()
                    if res.data:
                        persisted.append(res.data[0])
                        continue
                except Exception as e:
                    logger.warning(f"Supabase trajectory insert failed ({e}), saving locally.")

            with SessionLocal() as db:
                target_dt = datetime.fromisoformat(payload["target_time"]) if isinstance(payload["target_time"], str) else payload["target_time"]
                rec = models.IcebergTrajectoryPrediction(
                    iceberg_id=iceberg_id,
                    target_time=target_dt,
                    predicted_latitude=payload["predicted_latitude"],
                    predicted_longitude=payload["predicted_longitude"],
                    probability=payload["probability"],
                    model_version=payload["model_version"]
                )
                db.add(rec)
                db.commit()
                db.refresh(rec)
                persisted.append({
                    "id": rec.id,
                    **payload
                })

        return persisted

    def _format_iceberg(self, b: models.Iceberg) -> Dict[str, Any]:
        return {
            "id": b.id,
            "external_id": b.external_id,
            "latitude": b.latitude,
            "longitude": b.longitude,
            "observation_time": b.observation_time.isoformat() if b.observation_time else None,
            "length": b.length,
            "width": b.width,
            "height": b.height,
            "speed": b.speed,
            "direction": b.direction,
            "source": b.source
        }

iceberg_repository = IcebergRepository()
