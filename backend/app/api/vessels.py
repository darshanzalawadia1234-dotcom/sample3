from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.schemas.ship import VesselCreate, VesselUpdate, VesselResponse
from app.supabase.repositories.vessel_repository import vessel_repository
from app.api.auth import get_current_user_optional

router = APIRouter(prefix="/api/vessels", tags=["VESSELS"])

@router.get("", response_model=List[VesselResponse], summary="List all polar research vessels")
def list_vessels(user: Optional[dict] = Depends(get_current_user_optional)):
    """Retrieve all active research vessels in the polar fleet registry from Supabase."""
    user_id = user.get("id") if user else None
    return vessel_repository.list_vessels(user_id=user_id)


@router.get("/{vessel_id}", response_model=VesselResponse, summary="Get single vessel by ID")
def get_vessel(vessel_id: int):
    """Retrieve full telemetry, polar class, and coordinates for single vessel."""
    vessel = vessel_repository.get_vessel_by_id(vessel_id)
    if not vessel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Vessel with ID {vessel_id} not found in polar registry."
        )
    return vessel


@router.post("", response_model=VesselResponse, status_code=status.HTTP_201_CREATED, summary="Register a new vessel")
def register_vessel(body: VesselCreate, user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Register an expedition vessel in Supabase.
    Persisted permanently and associated with the authenticated user.
    """
    user_id = user.get("id") if user else None
    try:
        created = vessel_repository.create_vessel(body.model_dump(), user_id=user_id)
        return created
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to register vessel: {str(e)}"
        )


@router.put("/{vessel_id}", response_model=VesselResponse, summary="Update vessel telemetry and parameters")
def update_vessel(vessel_id: int, body: VesselUpdate, user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Update position, speed, or parameters for an existing vessel in Supabase.
    Generates an immutable audit log record with previous and new values.
    """
    user_id = user.get("id") if user else None
    try:
        updated = vessel_repository.update_vessel(
            vessel_id,
            body.model_dump(exclude_unset=True),
            user_id=user_id
        )
        if not updated:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vessel with ID {vessel_id} not found."
            )
        return updated
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update vessel: {str(e)}"
        )


@router.delete("/{vessel_id}", status_code=status.HTTP_200_OK, summary="Deregister vessel from registry")
def delete_vessel(vessel_id: int, user: Optional[dict] = Depends(get_current_user_optional)):
    """
    Remove vessel from Supabase polar fleet registry with ownership check and audit logging.
    """
    user_id = user.get("id") if user else None
    try:
        success = vessel_repository.delete_vessel(vessel_id, user_id=user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vessel with ID {vessel_id} not found."
            )
        return {"success": True, "message": f"Vessel {vessel_id} successfully deleted from registry."}
    except PermissionError as pe:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(pe))
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete vessel: {str(e)}"
        )
