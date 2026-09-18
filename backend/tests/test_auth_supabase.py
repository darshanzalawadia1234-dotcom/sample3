import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_auth_signup_and_login():
    # 1. Sign up new operator
    signup_payload = {
        "email": "test_operator@antarctic.org",
        "password": "strongpolarpass123",
        "full_name": "Explorer Amundsen",
        "organization": "Norwegian Polar Institute",
        "role": "Navigator"
    }
    signup_resp = client.post("/api/auth/signup", json=signup_payload)
    assert signup_resp.status_code == 201
    signup_data = signup_resp.json()
    assert "access_token" in signup_data
    assert signup_data["user"]["email"] == "test_operator@antarctic.org"

    token = signup_data["access_token"]

    # 2. Check /api/auth/me with Bearer token
    me_resp = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    me_data = me_resp.json()
    assert me_data["email"] == "test_operator@antarctic.org"

    # 3. Log in with credentials
    login_resp = client.post("/api/auth/login", json={
        "email": "test_operator@antarctic.org",
        "password": "strongpolarpass123"
    })
    assert login_resp.status_code == 200
    login_data = login_resp.json()
    assert "access_token" in login_data

    # 4. Invalid login attempt
    bad_login = client.post("/api/auth/login", json={
        "email": "test_operator@antarctic.org",
        "password": "wrongpassword"
    })
    assert bad_login.status_code == 400

    # 5. Log out
    logout_resp = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert logout_resp.status_code == 200
