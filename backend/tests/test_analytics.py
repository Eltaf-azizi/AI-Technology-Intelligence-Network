class TestAnalytics:
    def test_dashboard_empty(self, client):
        d = client.get("/api/analytics/dashboard").json()
        assert d["summary"]["total_technologies"] == 0

    def test_dashboard_seeded(self, seeded_client):
        d = seeded_client.get("/api/analytics/dashboard").json()
        assert d["summary"]["total_technologies"] > 0
        assert len(d["category_distribution"]) > 0
        assert len(d["top_by_popularity"]) > 0

    def test_summary(self, seeded_client):
        d = seeded_client.get("/api/analytics/summary").json()
        assert d["total_technologies"] > 0
