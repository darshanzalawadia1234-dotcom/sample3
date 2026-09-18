from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models
from .audit_repository import audit_repository

class VesselRepository:
    def list_vessels(self, user_id: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all vessels or vessels accessible to user."""
        client = get_supabase_client()
        if client is not None:
            try:
                query = client.table("vessels").select("*").order("vessel_name")
                if user_id:
                    query = query.or_(f"user_id.is.null,user_id.eq.{user_id}")
                res = query.execute()
                if res.data is not None:
                    return [self._format_vessel_dict(v) for v in res.data]
            except Exception as e:
                logger.warning(f"Supabase list_vessels failed ({e}), falling back to database.")

        # Fallback to local database
        with SessionLocal() as db:
            stmt = select(models.Vessel).order_by(models.Vessel.vessel_name)
            if user_id:
                stmt = stmt.where((models.Vessel.user_id.is_(None)) | (models.Vessel.user_id == user_id))
            vessels = db.scalars(stmt).all()
            return [self._format_vessel_model(v) for v in vessels]

    def get_vessel_by_id(self, vessel_id: int) -> Optional[Dict[str, Any]]:
        """Retrieve vessel by primary ID."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("vessels").select("*").eq("id", vessel_id).single().execute()
                if res.data:
                    return self._format_vessel_dict(res.data)
            except Exception as e:
                logger.warning(f"Supabase get_vessel_by_id failed ({e}), falling back to database.")

        with SessionLocal() as db:
            vessel = db.scalar(select(models.Vessel).where(models.Vessel.id == vessel_id))
            if vessel:
                return self._format_vessel_model(vessel)
        return None

    def create_vessel(self, vessel_data: Dict[str, Any], user_id: Optional[str] = None) -> Dict[str, Any]:
        """Register a new vessel into Supabase with audit logging."""
        payload = self._clean_payload(vessel_data)
        if user_id:
            payload["user_id"] = user_id

        payload["created_at"] = datetime.now(timezone.utc).isoformat()
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()

        client = get_supabase_client()
        created_record = None

        if client is not None:
            try:
                logger.info(f"Attempting to register vessel '{payload.get('vessel_name')}' directly into Supabase...")
                res = client.table("vessels").insert(payload).execute()
                if res.data and len(res.data) > 0:
                    created_record = self._format_vessel_dict(res.data[0])
                    logger.info(f"SUCCESS: Vessel '{created_record.get('name')}' registered in Supabase with ID {created_record.get('id')}")
            except Exception as e:
                logger.warning(f"Supabase create_vessel failed: {e}. Falling back to local database persistence.")

        # Always ensure local persistence as well for offline resilience
        with SessionLocal() as db:
            local_id = created_record.get("id") if (created_record and isinstance(created_record.get("id"), int)) else None
            vessel = models.Vessel(
                id=local_id,
                user_id=payload.get("user_id"),
                vessel_name=payload.get("vessel_name", "Unknown Vessel"),
                registration_number=payload.get("registration_number"),
                imo_number=payload.get("imo_number"),
                call_sign=payload.get("call_sign"),
                vessel_type=payload.get("vessel_type", "Research Vessel"),
                owner_name=payload.get("owner_name"),
                latitude=payload.get("latitude", -64.82),
                longitude=payload.get("longitude", -58.25),
                destination_latitude=payload.get("destination_latitude"),
                destination_longitude=payload.get("destination_longitude"),
                destination=payload.get("destination", "Rothera Station"),
                max_speed=payload.get("max_speed", 15.0),
                normal_speed=payload.get("normal_speed", 11.0),
                fuel_consumption_rate=payload.get("fuel_consumption_rate", 85.0),
                fuel_capacity=payload.get("fuel_capacity", 950000.0),
                ice_class=payload.get("ice_class", "PC3"),
                status=payload.get("status", "OPERATIONAL")
            )
            try:
                db.add(vessel)
                db.commit()
                db.refresh(vessel)
                if created_record is None:
                    created_record = self._format_vessel_model(vessel)
            except Exception as db_err:
                db.rollback()
                logger.warning(f"Local SQLite sync note: {db_err}")
                if created_record is None:
                    raise db_err

        # Audit log creation
        audit_repository.log_action(
            entity_type="VESSEL",
            entity_id=str(created_record.get("id", "0")),
            action="VESSEL_CREATED",
            user_id=user_id,
            new_data=created_record
        )
        return created_record

    def update_vessel(
        self,
        vessel_id: int,
        update_data: Dict[str, Any],
        user_id: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Update existing vessel with ownership check and audit logging."""
        current = self.get_vessel_by_id(vessel_id)
        if not current:
            return None

        # Verify ownership if user_id is provided and vessel has an owner
        if user_id and current.get("user_id") and str(current.get("user_id")) != str(user_id):
            raise PermissionError("Access denied: You do not have permission to modify this vessel.")

        payload = self._clean_payload(update_data)
        payload["updated_at"] = datetime.now(timezone.utc).isoformat()

        # Compute diff for audit log
        old_data_diff = {}
        new_data_diff = {}
        for k, v in payload.items():
            if k in current and current[k] != v:
                old_data_diff[k] = current[k]
                new_data_diff[k] = v

        updated_record = None
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("vessels").update(payload).eq("id", vessel_id).execute()
                if res.data and len(res.data) > 0:
                    updated_record = self._format_vessel_dict(res.data[0])
            except Exception as e:
                logger.warning(f"Supabase update_vessel failed ({e}), updating in local database.")

        if updated_record is None:
            with SessionLocal() as db:
                vessel = db.scalar(select(models.Vessel).where(models.Vessel.id == vessel_id))
                if vessel:
                    for k, v in payload.items():
                        if k == "updated_at":
                            vessel.updated_at = datetime.now(timezone.utc)
                        elif hasattr(vessel, k):
                            setattr(vessel, k, v)
                    db.commit()
                    db.refresh(vessel)
                    updated_record = self._format_vessel_model(vessel)

        # Audit log update
        if updated_record and (old_data_diff or new_data_diff):
            audit_repository.log_action(
                entity_type="VESSEL",
                entity_id=str(vessel_id),
                action="VESSEL_UPDATED",
                user_id=user_id,
                old_data=old_data_diff,
                new_data=new_data_diff
            )

        return updated_record

    def delete_vessel(self, vessel_id: int, user_id: Optional[str] = None) -> bool:
        """Deregister a vessel from Supabase with ownership check and audit logging."""
        current = self.get_vessel_by_id(vessel_id)
        if not current:
            return False

        if user_id and current.get("user_id") and str(current.get("user_id")) != str(user_id):
            raise PermissionError("Access denied: You do not have permission to delete this vessel.")

        deleted = False
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("vessels").delete().eq("id", vessel_id).execute()
                deleted = True
            except Exception as e:
                logger.warning(f"Supabase delete_vessel failed ({e}), deleting in local database.")

        if not deleted:
            with SessionLocal() as db:
                vessel = db.scalar(select(models.Vessel).where(models.Vessel.id == vessel_id))
                if vessel:
                    db.delete(vessel)
                    db.commit()
                    deleted = True

        if deleted:
            audit_repository.log_action(
                entity_type="VESSEL",
                entity_id=str(vessel_id),
                action="VESSEL_DELETED",
                user_id=user_id,
                old_data=current
            )
        return deleted

    def _clean_payload(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Maps incoming fields to exact database column names."""
        clean = {}
        # Support vessel_name or name
        if "vessel_name" in data and data["vessel_name"] is not None:
            clean["vessel_name"] = str(data["vessel_name"])
        elif "name" in data and data["name"] is not None:
            clean["vessel_name"] = str(data["name"])

        field_mappings = {
            "registration_number": "registration_number",
            "imo_number": "imo_number",
            "call_sign": "call_sign",
            "vessel_type": "vessel_type",
            "owner_name": "owner_name",
            "latitude": "latitude",
            "longitude": "longitude",
            "destination_latitude": "destination_latitude",
            "destLatitude": "destination_latitude",
            "destination_longitude": "destination_longitude",
            "destLongitude": "destination_longitude",
            "destination": "destination",
            "max_speed": "max_speed",
            "maxSpeed": "max_speed",
            "normal_speed": "normal_speed",
            "normalSpeed": "normal_speed",
            "fuel_consumption_rate": "fuel_consumption_rate",
            "fuelConsumptionRate": "fuel_consumption_rate",
            "fuel_capacity": "fuel_capacity",
            "fuelCapacity": "fuel_capacity",
            "ice_class": "ice_class",
            "iceClass": "ice_class",
            "status": "status"
        }
        numeric_keys = {
            "latitude", "longitude", "destination_latitude", "destination_longitude",
            "max_speed", "normal_speed", "fuel_consumption_rate", "fuel_capacity"
        }
        for src_key, db_col in field_mappings.items():
            if src_key in data and data[src_key] is not None:
                val = data[src_key]
                if db_col in numeric_keys:
                    try:
                        clean[db_col] = float(val)
                    except (ValueError, TypeError):
                        clean[db_col] = val
                else:
                    clean[db_col] = val

        return clean

    def _format_vessel_dict(self, d: Dict[str, Any]) -> Dict[str, Any]:
        v_name = d.get("vessel_name") or d.get("name") or "Unnamed Vessel"
        return {
            "id": d.get("id"),
            "user_id": d.get("user_id"),
            "name": v_name,
            "vessel_name": v_name,
            "registration_number": d.get("registration_number"),
            "imo_number": d.get("imo_number"),
            "call_sign": d.get("call_sign"),
            "vessel_type": d.get("vessel_type", "Research Vessel"),
            "owner_name": d.get("owner_name"),
            "latitude": float(d.get("latitude", 0.0)),
            "longitude": float(d.get("longitude", 0.0)),
            "destination_latitude": d.get("destination_latitude"),
            "destination_longitude": d.get("destination_longitude"),
            "destination": d.get("destination"),
            "max_speed": float(d.get("max_speed", 15.0)),
            "normal_speed": float(d.get("normal_speed", 11.0)),
            "fuel_consumption_rate": float(d.get("fuel_consumption_rate", 85.0)),
            "fuel_capacity": float(d.get("fuel_capacity", 950000.0)),
            "ice_class": d.get("ice_class", "PC3"),
            "status": d.get("status", "OPERATIONAL"),
            "created_at": d.get("created_at"),
            "updated_at": d.get("updated_at")
        }

    def _format_vessel_model(self, m: models.Vessel) -> Dict[str, Any]:
        return {
            "id": m.id,
            "user_id": m.user_id,
            "name": m.vessel_name,
            "vessel_name": m.vessel_name,
            "registration_number": m.registration_number,
            "imo_number": m.imo_number,
            "call_sign": m.call_sign,
            "vessel_type": m.vessel_type,
            "owner_name": m.owner_name,
            "latitude": m.latitude,
            "longitude": m.longitude,
            "destination_latitude": m.destination_latitude,
            "destination_longitude": m.destination_longitude,
            "destination": m.destination,
            "max_speed": m.max_speed,
            "normal_speed": m.normal_speed,
            "fuel_consumption_rate": m.fuel_consumption_rate,
            "fuel_capacity": m.fuel_capacity,
            "ice_class": m.ice_class,
            "status": m.status,
            "created_at": m.created_at.isoformat() if hasattr(m, "created_at") and m.created_at else None,
            "updated_at": m.updated_at.isoformat() if hasattr(m, "updated_at") and m.updated_at else None
        }

vessel_repository = VesselRepository()
