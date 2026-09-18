import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_route_optimization_and_history_persistence():
    route_req = {
        "startLat": -64.82,
        "startLon": -58.25,
        "destLat": -67.57,
        "destLon": -68.13,
        "weights": {
            "safety": 0.7,
            "fuel": 0.2,
            "time": 0.1
        }
    }

    # 1. Optimize route
    opt_resp = client.post("/api/route/optimize", json=route_req)
    assert opt_resp.status_code == 200
    opt_data = opt_resp.json()
    assert "recommendedRoute" in opt_data
    assert "options" in opt_data
    assert "dbRequestId" in opt_data

    db_req_id = opt_data["dbRequestId"]

    # 2. Check route history contains the record
    hist_resp = client.get("/api/routes/history")
    assert hist_resp.status_code == 200
    hist_data = hist_resp.json()
    assert "history" in hist_data
    assert len(hist_data["history"]) > 0

    # 3. Retrieve specific route by ID
    single_resp = client.get(f"/api/routes/{db_req_id}")
    assert single_resp.status_code == 200
    assert single_resp.json()["id"] == db_req_id

    # 4. Test route comparison endpoint
    comp_resp = client.post("/api/route/compare", json=route_req)
    assert comp_resp.status_code == 200
    assert "options" in comp_resp.json()
