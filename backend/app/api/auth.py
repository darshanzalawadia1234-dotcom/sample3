from fastapi import APIRouter, HTTPException, Depends, Header, status
from typing import Optional
from app.core.logging_config import logger
from app.supabase.client import get_supabase_client
from app.supabase.repositories.profile_repository import profile_repository
from app.schemas.auth import (
    UserSignUpRequest, UserLoginRequest, AuthResponse, UserProfileResponse
)

router = APIRouter(prefix="/api/auth", tags=["AUTH"])

# In-memory session store for demo mode fallback
_demo_users = {
    "operator@antarctic.org": {
        "id": "00000000-0000-0000-0000-000000000001",
        "email": "operator@antarctic.org",
        "password": "demopassword123",
        "full_name": "Dr. Sarah Evans",
        "organization": "British Antarctic Survey",
        "role": "Lead Polar Navigator"
    }
}
_demo_tokens = {
    "demo_token_polar_navigator": "00000000-0000-0000-0000-000000000001"
}

def get_current_user_optional(authorization: Optional[str] = Header(None)) -> Optional[dict]:
    """Dependency: Extract authenticated user from Bearer token if provided."""
    if not authorization or not authorization.startswith("Bearer "):
        return None

    token = authorization.replace("Bearer ", "").strip()
    if not token:
        return None

    # 1. Check demo mode tokens
    if token in _demo_tokens:
        uid = _demo_tokens[token]
        user_info = next((u for u in _demo_users.values() if u["id"] == uid), None)
        if user_info:
            return user_info

    # 2. Try Supabase Auth get_user
    client = get_supabase_client()
    if client is not None:
        try:
            user_resp = client.auth.get_user(token)
            if user_resp and user_resp.user:
                u = user_resp.user
                profile = profile_repository.get_profile(str(u.id)) or {}
                return {
                    "id": str(u.id),
                    "email": u.email,
                    "full_name": profile.get("full_name") or u.user_metadata.get("full_name"),
                    "organization": profile.get("organization") or u.user_metadata.get("organization"),
                    "role": profile.get("role") or u.user_metadata.get("role", "operator")
                }
        except Exception as e:
            logger.debug(f"Supabase token validation error: {e}")

    return None

def get_current_user(authorization: Optional[str] = Header(None)) -> dict:
    """Dependency: Requires valid authentication or raises 401."""
    user = get_current_user_optional(authorization)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    return user


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED, summary="Sign up new polar operator")
async def signup(body: UserSignUpRequest):
    """Register a new user through Supabase Auth and initialize profile."""
    client = get_supabase_client()

    if client is not None:
        try:
            res = client.auth.sign_up({
                "email": body.email,
                "password": body.password,
                "options": {
                    "data": {
                        "full_name": body.full_name,
                        "organization": body.organization,
                        "role": body.role
                    }
                }
            })
            if res.user:
                uid = str(res.user.id)
                profile_repository.upsert_profile(uid, {
                    "full_name": body.full_name,
                    "organization": body.organization,
                    "role": body.role
                })
                token = res.session.access_token if res.session else f"token_{uid}"
                return {
                    "access_token": token,
                    "token_type": "bearer",
                    "user": {
                        "id": uid,
                        "email": body.email,
                        "full_name": body.full_name,
                        "organization": body.organization,
                        "role": body.role
                    },
                    "message": "User registered successfully in Supabase"
                }
        except Exception as e:
            logger.warning(f"Supabase signup failed ({e}), using fallback demo handler.")

    # Fallback signup (demo mode)
    import uuid
    uid = str(uuid.uuid4())
    token = f"demo_token_{uid[:8]}"
    _demo_users[body.email] = {
        "id": uid,
        "email": body.email,
        "password": body.password,
        "full_name": body.full_name,
        "organization": body.organization,
        "role": body.role
    }
    _demo_tokens[token] = uid
    profile_repository.upsert_profile(uid, {
        "full_name": body.full_name,
        "organization": body.organization,
        "role": body.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": uid,
            "email": body.email,
            "full_name": body.full_name,
            "organization": body.organization,
            "role": body.role
        },
        "message": "User registered successfully (Demo Mode)"
    }


@router.post("/login", response_model=AuthResponse, summary="Sign in with credentials")
async def login(body: UserLoginRequest):
    """Authenticate with Supabase Auth."""
    client = get_supabase_client()

    if client is not None:
        try:
            res = client.auth.sign_in_with_password({
                "email": body.email,
                "password": body.password
            })
            if res.user and res.session:
                uid = str(res.user.id)
                profile = profile_repository.get_profile(uid) or {}
                return {
                    "access_token": res.session.access_token,
                    "token_type": "bearer",
                    "user": {
                        "id": uid,
                        "email": res.user.email,
                        "full_name": profile.get("full_name") or res.user.user_metadata.get("full_name", "Operator"),
                        "organization": profile.get("organization") or res.user.user_metadata.get("organization"),
                        "role": profile.get("role") or res.user.user_metadata.get("role", "operator")
                    },
                    "message": "Authenticated successfully with Supabase"
                }
        except Exception as e:
            err_msg = str(e)
            if "invalid" in err_msg.lower() or "credentials" in err_msg.lower():
                raise HTTPException(status_code=400, detail="Invalid email or password.")
            logger.warning(f"Supabase login failed ({e}), checking demo users.")

    # Demo fallback check
    user_record = _demo_users.get(body.email)
    if user_record and user_record["password"] == body.password:
        token = f"demo_token_{user_record['id'][:8]}"
        _demo_tokens[token] = user_record["id"]
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_record["id"],
                "email": user_record["email"],
                "full_name": user_record["full_name"],
                "organization": user_record["organization"],
                "role": user_record["role"]
            },
            "message": "Authenticated successfully (Demo Mode)"
        }

    raise HTTPException(status_code=400, detail="Invalid email or password.")


@router.post("/logout", summary="Sign out current session")
async def logout(authorization: Optional[str] = Header(None)):
    """Sign out session."""
    client = get_supabase_client()
    if client is not None:
        try:
            client.auth.sign_out()
        except Exception:
            pass

    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "").strip()
        _demo_tokens.pop(token, None)

    return {"success": True, "message": "Successfully logged out."}


@router.get("/me", response_model=UserProfileResponse, summary="Get current authenticated operator profile")
async def get_me(user: dict = Depends(get_current_user)):
    """Retrieve details and operational role for authenticated user."""
    return user
