from typing import Optional, Dict, Any
from datetime import datetime, timezone
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.database.connection import SessionLocal
from app.database import models

# Sensitive keys to never log in audit entries
SENSITIVE_KEYS = {"password", "secret", "token", "api_key", "key", "authorization"}

def _sanitize_data(data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    if not data or not isinstance(data, dict):
        return data
    sanitized = {}
    for k, v in data.items():
        if any(s in k.lower() for s in SENSITIVE_KEYS):
            sanitized[k] = "[REDACTED]"
        elif isinstance(v, dict):
            sanitized[k] = _sanitize_data(v)
        else:
            sanitized[k] = v
    return sanitized

class AuditRepository:
    def log_action(
        self,
        entity_type: str,
        entity_id: str,
        action: str,
        user_id: Optional[str] = None,
        old_data: Optional[Dict[str, Any]] = None,
        new_data: Optional[Dict[str, Any]] = None
    ):
        """
        Record a structured audit log entry to Supabase audit_logs table,
        with local database fallback.
        """
        clean_old = _sanitize_data(old_data)
        clean_new = _sanitize_data(new_data)

        payload = {
            "entity_type": entity_type,
            "entity_id": str(entity_id),
            "action": action,
            "user_id": user_id,
            "old_data": clean_old,
            "new_data": clean_new,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        # 1. Attempt Supabase insert
        client = get_supabase_client()
        if client is not None:
            try:
                client.table("audit_logs").insert(payload).execute()
                logger.info(f"Audit log saved to Supabase: [{action}] {entity_type}:{entity_id}")
                return
            except Exception as e:
                logger.warning(f"Failed to write audit log to Supabase ({e}), saving to local db.")

        # 2. Local database fallback
        try:
            with SessionLocal() as db:
                entry = models.AuditLog(
                    entity_type=entity_type,
                    entity_id=str(entity_id),
                    action=action,
                    user_id=user_id,
                    old_data=clean_old,
                    new_data=clean_new
                )
                db.add(entry)
                db.commit()
                logger.info(f"Audit log recorded locally: [{action}] {entity_type}:{entity_id}")
        except Exception as e:
            logger.error(f"Error persisting audit log: {e}")

audit_repository = AuditRepository()
