class TestMentor:
    def test_chat(self, seeded_client):
        r = seeded_client.post("/api/mentor/chat", json={"message": "Hello!", "history": []})
        assert r.status_code == 200 and len(r.json()["reply"]) > 0

    def test_chat_with_history(self, seeded_client):
        r = seeded_client.post("/api/mentor/chat", json={
            "message": "What is Python?",
            "history": [{"role": "user", "content": "Hi"}, {"role": "assistant", "content": "Hello"}]
        })
        assert "python" in r.json()["reply"].lower()

    def test_chat_career(self, seeded_client):
        r = seeded_client.post("/api/mentor/chat", json={"message": "What career paths?", "history": []})
        assert r.status_code == 200

    def test_suggestions(self, seeded_client):
        r = seeded_client.get("/api/mentor/suggestions")
        assert len(r.json()["suggestions"]) > 0
