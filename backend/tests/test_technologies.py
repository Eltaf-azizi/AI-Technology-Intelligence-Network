class TestTechnologies:
    def test_list_empty(self, client):
        r = client.get("/api/technologies")
        assert r.status_code == 200 and r.json()["total"] == 0

    def test_list_seeded(self, seeded_client):
        r = seeded_client.get("/api/technologies")
        assert r.status_code == 200 and r.json()["total"] > 0

    def test_pagination(self, seeded_client):
        r = seeded_client.get("/api/technologies?page=1&per_page=5")
        assert r.status_code == 200 and len(r.json()["technologies"]) <= 5

    def test_get_by_slug(self, seeded_client):
        r = seeded_client.get("/api/technologies/python")
        assert r.status_code == 200 and r.json()["name"] == "Python"

    def test_get_not_found(self, seeded_client):
        assert seeded_client.get("/api/technologies/nope").status_code == 404

    def test_categories(self, seeded_client):
        r = seeded_client.get("/api/categories")
        assert r.status_code == 200 and r.json()["total"] > 0

    def test_by_category(self, seeded_client):
        r = seeded_client.get("/api/categories/Artificial Intelligence")
        assert r.status_code == 200 and r.json()["total"] > 0

    def test_by_category_empty(self, seeded_client):
        r = seeded_client.get("/api/categories/Nonexistent")
        assert r.json()["total"] == 0

    def test_search(self, seeded_client):
        r = seeded_client.get("/api/search?q=python")
        assert r.status_code == 200 and r.json()["total"] >= 1

    def test_search_empty(self, seeded_client):
        assert seeded_client.get("/api/search?q=").status_code == 422

    def test_search_no_results(self, seeded_client):
        r = seeded_client.get("/api/search?q=zzzzzzz")
        assert r.json()["total"] == 0
