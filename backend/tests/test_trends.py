class TestTrends:
    def test_list_empty(self, client):
        assert client.get("/api/trends").json() == []

    def test_summary(self, seeded_client):
        r = seeded_client.get("/api/trends/summary")
        d = r.json()
        assert d["total"] > 0 and d["average_growth"] > 0

    def test_by_stage(self, seeded_client):
        r = seeded_client.get("/api/trends/growth")
        assert all(t["stage"].lower() == "growth" for t in r.json())
