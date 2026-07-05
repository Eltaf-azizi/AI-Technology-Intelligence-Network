class TestComparisonEndpoints:
    def test_get_comparison_candidates(self, seeded_client):
        response = seeded_client.get("/api/compare/available")
        assert response.status_code == 200
        data = response.json()
        assert "technologies" in data
        assert len(data["technologies"]) > 0
        tech = data["technologies"][0]
        assert "slug" in tech
        assert "name" in tech

    def test_compare_technologies(self, seeded_client):
        response = seeded_client.get("/api/compare?tech1=python&tech2=javascript")
        assert response.status_code == 200
        data = response.json()
        assert data["tech1"] == "Python"
        assert data["tech2"] == "JavaScript"
        assert "strengths" in data
        assert "weaknesses" in data
        assert "recommendation" in data

    def test_compare_not_found(self, seeded_client):
        response = seeded_client.get("/api/compare?tech1=python&tech2=nonexistent")
        assert response.status_code == 404

    def test_compare_same(self, seeded_client):
        response = seeded_client.get("/api/compare?tech1=python&tech2=python")
        assert response.status_code == 200
