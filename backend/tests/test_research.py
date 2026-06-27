class TestResearch:
    def test_list_empty(self, client):
        assert client.get("/api/research").json() == []

    def test_get(self, seeded_client):
        assert seeded_client.get("/api/research/1").status_code == 200

    def test_upload(self, client, auth_headers):
        r = client.post("/api/research/upload", params={"title": "Test", "technologies": "python"}, headers=auth_headers)
        assert r.status_code == 200 and r.json()["title"] == "Test"

    def test_upload_unauth(self, seeded_client):
        assert seeded_client.post("/api/research/upload", params={"title": "Test"}).status_code == 401
