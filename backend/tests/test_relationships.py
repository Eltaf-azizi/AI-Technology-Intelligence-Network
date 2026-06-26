class TestRelationships:
    def test_list_empty(self, client):
        assert client.get("/api/relationships").json() == []

    def test_list_seeded(self, seeded_client):
        r = seeded_client.get("/api/relationships")
        assert r.status_code == 200 and len(r.json()) > 0

    def test_graph(self, seeded_client):
        r = seeded_client.get("/api/graph")
        d = r.json()
        assert "nodes" in d and "edges" in d and len(d["nodes"]) > 0

    def test_tech_rels(self, seeded_client):
        r = seeded_client.get("/api/technologies/python/relationships")
        assert r.status_code == 200 and len(r.json()["relationships"]) > 0

    def test_tech_rels_not_found(self, seeded_client):
        r = seeded_client.get("/api/technologies/nope/relationships")
        assert len(r.json()["relationships"]) == 0

    def test_related(self, seeded_client):
        r = seeded_client.get("/api/technologies/python/related")
        assert r.status_code == 200 and len(r.json()["related"]) > 0
