from typing import Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy import select
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

class ProfileRepository:
    def get_profile(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieve user profile from Supabase profiles table."""
        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("profiles").select("*").eq("id", user_id).single().execute()
                if res.data:
                    return res.data
            except Exception as e:
                logger.warning(f"Supabase get_profile failed ({e}), checking local database.")

        with SessionLocal() as db:
            p = db.scalar(select(models.Profile).where(models.Profile.id == user_id))
            if p:
                return {
                    "id": p.id,
                    "full_name": p.full_name,
                    "organization": p.organization,
                    "role": p.role,
                    "created_at": p.created_at.isoformat() if p.created_at else None,
                    "updated_at": p.updated_at.isoformat() if p.updated_at else None
                }
        return None

    def upsert_profile(self, user_id: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create or update user profile."""
        payload = {
            "id": user_id,
            "full_name": data.get("full_name", "Polar Expedition Operator"),
            "organization": data.get("organization", "Antarctic Research Institute"),
            "role": data.get("role", "operator"),
            "updated_at": datetime.now(timezone.utc).isoformat()
        }

        client = get_supabase_client()
        if client is not None:
            try:
                res = client.table("profiles").upsert(payload).execute()
                if res.data and len(res.data) > 0:
                    return res.data[0]
            except Exception as e:
                logger.warning(f"Supabase upsert_profile failed ({e}), saving to local database.")

        with SessionLocal() as db:
            p = db.scalar(select(models.Profile).where(models.Profile.id == user_id))
            if not p:
                p = models.Profile(
                    id=user_id,
                    full_name=payload.get("full_name"),
                    organization=payload.get("organization"),
                    role=payload.get("role", "operator")
                )
                db.add(p)
            else:
                p.full_name = payload["full_name"]
                p.organization = payload["organization"]
                p.role = payload["role"]
            db.commit()
            return payload

profile_repository = ProfileRepository()
