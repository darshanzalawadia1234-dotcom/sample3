import os
from typing import Optional
from app.core.config import settings
from app.core.logging_config import logger

_supabase_client = None

def get_supabase_client():
    """
    Returns the singleton Supabase client instance.
    Uses SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_KEY) if available for full server-side capability,
    falling back to SUPABASE_PUBLISHABLE_KEY.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    url = settings.SUPABASE_URL or os.getenv("SUPABASE_URL", "").strip()
    key = (
        settings.SUPABASE_SECRET_KEY
        or settings.SUPABASE_SERVICE_KEY
        or os.getenv("SUPABASE_SECRET_KEY", "")
        or os.getenv("SUPABASE_SERVICE_KEY", "")
        or settings.SUPABASE_PUBLISHABLE_KEY
        or os.getenv("SUPABASE_PUBLISHABLE_KEY", "")
    ).strip()

    if not url or not key:
        logger.info("Supabase credentials not configured in environment. Using resilient local/database fallback.")
        return None

    try:
        from supabase import create_client, Client
        _supabase_client = create_client(url, key)
        logger.info(f"Supabase client initialized successfully for {url}")
        return _supabase_client
    except Exception as e:
        logger.warning(f"Could not initialize Supabase client: {e}. Operating in fallback mode.")
        return None


def is_supabase_connected() -> bool:
    """Checks whether the Supabase client is actively initialized and responsive."""
    client = get_supabase_client()
    if client is None:
        return False
    try:
        # Simple ping query to vessels table
        res = client.table("vessels").select("id").limit(1).execute()
        return True
    except Exception:
        return False
