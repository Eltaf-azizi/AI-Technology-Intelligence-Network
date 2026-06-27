class TestRels:
    def test_list_empty(self, client):
        assert client.get("/api/relationships").json() == []

    def test_graph(self, seeded_client):
        r = seeded_client.get("/api/graph")
        assert "nodes" in r.json() and len(r.json()["nodes"]) > 0

    def test_tech_rels(self, seeded_client):
        r = seeded_client.get("/api/technologies/python/relationships")
        assert len(r.json()["relationships"]) > 0

    def test_related(self, seeded_client):
        r = seeded_client.get("/api/technologies/python/related")
        assert len(r.json()["related"]) > 0
