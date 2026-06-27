class TestCareers:
    def test_list_empty(self, client):
        assert client.get("/api/careers").json()["total"] == 0

    def test_list_seeded(self, seeded_client):
        assert seeded_client.get("/api/careers").json()["total"] > 0

    def test_get(self, seeded_client):
        assert seeded_client.get("/api/careers/1").status_code == 200

    def test_path(self, seeded_client):
        r = seeded_client.get("/api/careers/1/path")
        assert "steps" in r.json()
