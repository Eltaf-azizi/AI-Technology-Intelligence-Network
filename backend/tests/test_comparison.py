class TestComparison:
    def test_available(self, seeded_client):
        r = seeded_client.get("/api/compare/available")
        assert r.status_code == 200 and len(r.json()["technologies"]) > 0

    def test_compare(self, seeded_client):
        r = seeded_client.get("/api/compare?tech1=python&tech2=javascript")
        assert r.status_code == 200 and r.json()["tech1"] == "Python"

    def test_compare_not_found(self, seeded_client):
        assert seeded_client.get("/api/compare?tech1=python&tech2=nonexistent").status_code == 404

    def test_compare_same(self, seeded_client):
        assert seeded_client.get("/api/compare?tech1=python&tech2=python").status_code == 200
