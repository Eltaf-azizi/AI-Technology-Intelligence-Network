class TestTech:
    def test_list_empty(self, client):
        assert client.get("/api/technologies").json()["total"] == 0

    def test_list_seeded(self, seeded_client):
        r = seeded_client.get("/api/technologies")
        assert r.json()["total"] > 0

    def test_by_slug(self, seeded_client):
        r = seeded_client.get("/api/technologies/python")
        assert r.status_code == 200 and r.json()["name"] == "Python"

    def test_not_found(self, seeded_client):
        assert seeded_client.get("/api/technologies/nope").status_code == 404

    def test_categories(self, seeded_client):
        r = seeded_client.get("/api/categories")
        assert r.json()["total"] > 0

    def test_by_category(self, seeded_client):
        r = seeded_client.get("/api/categories/Artificial Intelligence")
        assert r.status_code == 200 and r.json()["total"] > 0

    def test_search(self, seeded_client):
        r = seeded_client.get("/api/search?q=python")
        assert r.json()["total"] >= 1

    def test_search_empty(self, seeded_client):
        assert seeded_client.get("/api/search?q=").status_code == 422
