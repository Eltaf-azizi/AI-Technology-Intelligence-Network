class TestLearningPaths:
    def test_generate(self, seeded_client):
        r = seeded_client.post("/api/learning/generate", json={
            "goal": "machine learning", "current_skills": ["Python"], "time_available": "high", "difficulty": "Intermediate"
        })
        assert r.status_code == 200 and len(r.json()["steps"]) > 0

    def test_generate_no_skills(self, seeded_client):
        r = seeded_client.post("/api/learning/generate", json={
            "goal": "web development", "current_skills": [], "time_available": "medium", "difficulty": "Beginner"
        })
        assert r.status_code == 200 and len(r.json()["steps"]) > 0
