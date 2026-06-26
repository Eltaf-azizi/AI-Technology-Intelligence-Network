class TestResearch:
    def test_list_empty(self, client):
        assert client.get("/api/research").json() == []

    def test_list_seeded(self, seeded_client):
        r = seeded_client.get("/api/research")
        assert r.status_code == 200 and len(r.json()) > 0

    def test_get(self, seeded_client):
        assert seeded_client.get("/api/research/1").status_code == 200

    def test_get_not_found(self, seeded_client):
        assert seeded_client.get("/api/research/999").status_code == 404

    def test_upload_unauth(self, seeded_client):
        assert seeded_client.post("/api/research/upload", params={"title": "Test"}).status_code == 401

    def test_upload_auth(self, client, auth_headers):
        r = client.post("/api/research/upload", params={"title": "Test Paper", "technologies": "python,ml", "concepts": "testing"}, headers=auth_headers)
        assert r.status_code == 200 and r.json()["title"] == "Test Paper"

    def test_delete(self, client, auth_headers, seeded_client):
        seeded_client.delete("/api/research/1", headers=auth_headers)
        assert seeded_client.get("/api/research/1").status_code == 404
