class TestHealth:
    def test_health(self, client):
        r = client.get("/api/health")
        assert r.status_code == 200
        d = r.json()
        assert d["status"] == "online"

    def test_root(self, client):
        r = client.get("/api")
        assert r.status_code == 200
        assert "endpoints" in r.json()
