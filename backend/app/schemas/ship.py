from typing import Optional
from pydantic import BaseModel, Field, ConfigDict, model_validator

class VesselBase(BaseModel):
    name: Optional[str] = Field(None, description="Vessel identification name")
    vessel_name: Optional[str] = Field(None, description="Vessel identification name")
    registration_number: Optional[str] = None
    imo_number: Optional[str] = None
    call_sign: Optional[str] = None
    vessel_type: Optional[str] = Field("Research Vessel", description="Vessel classification")
    owner_name: Optional[str] = None

    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    destination_latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    destination_longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    destLatitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    destLongitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    destination: Optional[str] = None

    max_speed: Optional[float] = Field(15.0, gt=0.0, description="Max design speed in knots")
    maxSpeed: Optional[float] = Field(None, gt=0.0)
    normal_speed: Optional[float] = Field(12.0, gt=0.0, description="Cruising speed in knots")
    normalSpeed: Optional[float] = Field(None, gt=0.0)
    fuel_consumption_rate: Optional[float] = Field(80.0, gt=0.0, description="L/nm fuel burn rate")
    fuelConsumptionRate: Optional[float] = Field(None, gt=0.0)
    fuel_capacity: Optional[float] = Field(1000000.0, gt=0.0, description="Fuel capacity in liters")
    fuelCapacity: Optional[float] = Field(None, gt=0.0)
    ice_class: Optional[str] = Field("PC3", description="Polar Class rating")
    iceClass: Optional[str] = None
    status: str = Field("OPERATIONAL", description="Operating state")

    @model_validator(mode="before")
    @classmethod
    def reconcile_names_and_aliases(cls, values: dict):
        if not isinstance(values, dict):
            return values
        # Reconcile vessel_name / name
        if not values.get("vessel_name") and values.get("name"):
            values["vessel_name"] = values["name"]
        elif not values.get("name") and values.get("vessel_name"):
            values["name"] = values["vessel_name"]

        # Reconcile camelCase aliases
        if values.get("maxSpeed") is not None and values.get("max_speed") is None:
            values["max_speed"] = values["maxSpeed"]
        if values.get("normalSpeed") is not None and values.get("normal_speed") is None:
            values["normal_speed"] = values["normalSpeed"]
        if values.get("fuelConsumptionRate") is not None and values.get("fuel_consumption_rate") is None:
            values["fuel_consumption_rate"] = values["fuelConsumptionRate"]
        if values.get("fuelCapacity") is not None and values.get("fuel_capacity") is None:
            values["fuel_capacity"] = values["fuelCapacity"]
        if values.get("iceClass") is not None and values.get("ice_class") is None:
            values["ice_class"] = values["iceClass"]
        if values.get("destLatitude") is not None and values.get("destination_latitude") is None:
            values["destination_latitude"] = values["destLatitude"]
        if values.get("destLongitude") is not None and values.get("destination_longitude") is None:
            values["destination_longitude"] = values["destLongitude"]
        return values

class VesselCreate(VesselBase):
    pass

class VesselUpdate(BaseModel):
    name: Optional[str] = None
    vessel_name: Optional[str] = None
    registration_number: Optional[str] = None
    imo_number: Optional[str] = None
    call_sign: Optional[str] = None
    vessel_type: Optional[str] = None
    owner_name: Optional[str] = None

    latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    longitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    destination_latitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    destination_longitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    destLatitude: Optional[float] = Field(None, ge=-90.0, le=90.0)
    destLongitude: Optional[float] = Field(None, ge=-180.0, le=180.0)
    destination: Optional[str] = None

    max_speed: Optional[float] = Field(None, gt=0.0)
    maxSpeed: Optional[float] = Field(None, gt=0.0)
    normal_speed: Optional[float] = Field(None, gt=0.0)
    normalSpeed: Optional[float] = Field(None, gt=0.0)
    fuel_consumption_rate: Optional[float] = Field(None, gt=0.0)
    fuelConsumptionRate: Optional[float] = Field(None, gt=0.0)
    fuel_capacity: Optional[float] = Field(None, gt=0.0)
    fuelCapacity: Optional[float] = Field(None, gt=0.0)
    ice_class: Optional[str] = None
    iceClass: Optional[str] = None
    status: Optional[str] = None

class VesselResponse(VesselBase):
    id: int
    user_id: Optional[str] = None
    vessel_name: str
    name: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

# Compatibility aliases
ShipBase = VesselBase
ShipCreate = VesselCreate
ShipUpdate = VesselUpdate
ShipResponse = VesselResponse
