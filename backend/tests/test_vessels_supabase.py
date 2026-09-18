import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.supabase.repositories.vessel_repository import vessel_repository

client = TestClient(app)

def test_vessel_crud_and_persistence_lifecycle():
    # 1. Register new vessel
    vessel_payload = {
        "vessel_name": "RV Endurance II",
        "registration_number": "POLAR-END-99",
        "imo_number": "9876543",
        "call_sign": "END99",
        "vessel_type": "Icebreaker",
        "owner_name": "British Antarctic Expedition",
        "latitude": -65.20,
        "longitude": -64.10,
        "destination_latitude": -67.57,
        "destination_longitude": -68.13,
        "destination": "Rothera Station",
        "max_speed": 16.0,
        "normal_speed": 12.0,
        "fuel_consumption_rate": 82.0,
        "fuel_capacity": 1100000.0,
        "ice_class": "PC2",
        "status": "OPERATIONAL"
    }

    create_resp = client.post("/api/vessels", json=vessel_payload)
    assert create_resp.status_code == 201
    created_data = create_resp.json()
    vessel_id = created_data["id"]
    assert created_data["vessel_name"] == "RV Endurance II"
    assert created_data["max_speed"] == 16.0

    # 2. Retrieve vessel by ID
    get_resp = client.get(f"/api/vessels/{vessel_id}")
    assert get_resp.status_code == 200
    assert get_resp.json()["id"] == vessel_id

    # 3. Update vessel (change max_speed from 16.0 to 18.5)
    update_payload = {
        "max_speed": 18.5,
        "status": "TRANSITING"
    }
    update_resp = client.put(f"/api/vessels/{vessel_id}", json=update_payload)
    assert update_resp.status_code == 200
    updated_data = update_resp.json()
    assert updated_data["max_speed"] == 18.5
    assert updated_data["status"] == "TRANSITING"

    # 4. Verify persistence after get
    verify_resp = client.get(f"/api/vessels/{vessel_id}")
    assert verify_resp.status_code == 200
    assert verify_resp.json()["max_speed"] == 18.5

    # 5. Delete vessel
    delete_resp = client.delete(f"/api/vessels/{vessel_id}")
    assert delete_resp.status_code == 200

    # 6. Confirm 404 after deletion
    after_del_resp = client.get(f"/api/vessels/{vessel_id}")
    assert after_del_resp.status_code == 404


def test_vessel_validation_errors():
    # Invalid latitude (< -90)
    bad_lat = {
        "vessel_name": "Invalid Lat Ship",
        "latitude": -95.0,
        "longitude": -50.0
    }
    resp1 = client.post("/api/vessels", json=bad_lat)
    assert resp1.status_code == 422

    # Invalid speed (<= 0)
    bad_speed = {
        "vessel_name": "Zero Speed Ship",
        "latitude": -65.0,
        "longitude": -50.0,
        "max_speed": -5.0
    }
    resp2 = client.post("/api/vessels", json=bad_speed)
    assert resp2.status_code == 422


def test_vessel_ships_alias_compatibility():
    # Verify GET /api/ships returns list
    resp = client.get("/api/ships")
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)
