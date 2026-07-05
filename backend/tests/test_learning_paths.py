class TestLearningPathEndpoints:
    def test_generate_learning_path(self, seeded_client):
        response = seeded_client.post("/api/learning/generate", json={
            "goal": "machine learning",
            "current_skills": ["Python"],
            "time_available": "high",
            "difficulty": "Intermediate",
        })
        assert response.status_code == 200
        data = response.json()
        assert "id" in data
        assert "title" in data
        assert "steps" in data
        assert len(data["steps"]) > 0
        assert "total_time" in data

    def test_generate_path_without_skills(self, seeded_client):
        response = seeded_client.post("/api/learning/generate", json={
            "goal": "web development",
            "current_skills": [],
            "time_available": "medium",
            "difficulty": "Beginner",
        })
        assert response.status_code == 200
        data = response.json()
        assert len(data["steps"]) > 0

    def test_generate_path_short_goal(self, seeded_client):
        response = seeded_client.post("/api/learning/generate", json={
            "goal": "ai",
            "current_skills": [],
            "time_available": "low",
            "difficulty": "Advanced",
        })
        assert response.status_code == 200
