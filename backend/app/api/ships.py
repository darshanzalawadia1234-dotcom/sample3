from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from app.schemas.ship import ShipCreate, ShipUpdate, ShipResponse
from app.supabase.repositories.vessel_repository import vessel_repository
from app.api.auth import get_current_user_optional

router = APIRouter(prefix="/api/ships", tags=["SHIPS"])

@router.get("", response_model=List[ShipResponse], summary="List all registered research vessels (ships alias)")
def list_ships(user: Optional[dict] = Depends(get_current_user_optional)):
    """Retrieve all active research vessels in the polar fleet registry from Supabase."""
    user_id = user.get("id") if user else None
    return vessel_repository.list_vessels(user_id=user_id)


@router.get("/{ship_id}", response_model=ShipResponse, summary="Get vessel specifications by ID")
def get_ship(ship_id: int):
    """Retrieve specifications, Polar Class, fuel capacity, and assigned coordinates for single vessel."""
    vessel = vessel_repository.get_vessel_by_id(ship_id)
    if not vessel:
        raise HTTPException(status_code=404, detail=f"Vessel with ID {ship_id} not found.")
    return vessel


@router.post("", response_model=ShipResponse, status_code=status.HTTP_201_CREATED, summary="Register a new research vessel")
def register_ship(ship_in: ShipCreate, user: Optional[dict] = Depends(get_current_user_optional)):
    """Register an expedition vessel in Supabase."""
    user_id = user.get("id") if user else None
    try:
        created = vessel_repository.create_vessel(ship_in.model_dump(), user_id=user_id)
        return created
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to register vessel: {str(e)}")


@router.put("/{ship_id}", response_model=ShipResponse, summary="Update vessel telemetry and parameters")
def update_ship(ship_id: int, ship_in: ShipUpdate, user: Optional[dict] = Depends(get_current_user_optional)):
    """Update position, speed, or mission parameters for an existing vessel in Supabase."""
    user_id = user.get("id") if user else None
    try:
        updated = vessel_repository.update_vessel(
            ship_id,
            ship_in.model_dump(exclude_unset=True),
            user_id=user_id
        )
        if not updated:
            raise HTTPException(status_code=404, detail=f"Vessel with ID {ship_id} not found.")
        return updated
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to update vessel: {str(e)}")


@router.delete("/{ship_id}", status_code=status.HTTP_200_OK, summary="Remove vessel from registry")
def delete_ship(ship_id: int, user: Optional[dict] = Depends(get_current_user_optional)):
    """Deregister an expedition vessel from Supabase polar fleet registry."""
    user_id = user.get("id") if user else None
    try:
        success = vessel_repository.delete_vessel(ship_id, user_id=user_id)
        if not success:
            raise HTTPException(status_code=404, detail=f"Vessel with ID {ship_id} not found.")
        return {"success": True, "message": f"Vessel {ship_id} successfully deleted."}
    except PermissionError as pe:
        raise HTTPException(status_code=403, detail=str(pe))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to delete vessel: {str(e)}")
