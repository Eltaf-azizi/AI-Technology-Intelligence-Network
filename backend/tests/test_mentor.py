class TestMentor:
    def test_chat(self, seeded_client):
        r = seeded_client.post("/api/mentor/chat", json={"message": "Hello!", "history": []})
        assert r.status_code == 200 and len(r.json()["reply"]) > 0

    def test_suggestions(self, seeded_client):
        r = seeded_client.get("/api/mentor/suggestions")
        assert len(r.json()["suggestions"]) > 0
