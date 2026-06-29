class TestAnalytics:
    def test_dashboard_empty(self, client):
        d = client.get("/api/analytics/dashboard").json()
        assert d["summary"]["total_technologies"] == 0

    def test_dashboard_seeded(self, seeded_client):
        d = seeded_client.get("/api/analytics/dashboard").json()
        assert d["summary"]["total_technologies"] > 0
