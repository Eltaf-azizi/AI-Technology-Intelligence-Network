class TestHealth:
    def test_health_check(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        d = resp.json()
        assert d["status"] == "online"
        assert d["version"] == "2.0.0"

    def test_api_root(self, client):
        resp = client.get("/api")
        assert resp.status_code == 200
        assert "endpoints" in resp.json()
