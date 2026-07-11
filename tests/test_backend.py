from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    payload = response.json()
    assert payload["status"] == "online"


def test_technologies_endpoint():
    response = client.get("/api/technologies")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert data["total"] >= 0
    assert "technologies" in data


def test_careers_endpoint():
    response = client.get("/api/careers")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, dict)
    assert data["total"] >= 0
    assert "careers" in data


def test_mentor_chat_endpoint():
    response = client.post(
        "/api/mentor/chat",
        json={"message": "How do I become an AI engineer?"},
    )
    assert response.status_code == 200
    payload = response.json()
    assert "response" in payload
