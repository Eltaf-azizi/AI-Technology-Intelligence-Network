class TestCareers:
    def test_list_empty(self, client):
        r = client.get("/api/careers")
        assert r.json()["total"] == 0

    def test_list_seeded(self, seeded_client):
        r = seeded_client.get("/api/careers")
        assert r.status_code == 200 and r.json()["total"] > 0

    def test_get(self, seeded_client):
        assert seeded_client.get("/api/careers/1").status_code == 200

    def test_get_not_found(self, seeded_client):
        assert seeded_client.get("/api/careers/999").status_code == 404

    def test_path(self, seeded_client):
        r = seeded_client.get("/api/careers/1/path")
        assert r.status_code == 200 and "steps" in r.json()

    def test_path_not_found(self, seeded_client):
        assert seeded_client.get("/api/careers/999/path").status_code == 404
